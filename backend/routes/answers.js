const express = require('express');
const db = require('../db');
const { requireAuth, requireImam } = require('../middleware/middleware');
const router = express.Router();

// Create new answer (authenticated users only)
router.post('/', requireAuth, (req, res) => {
    const { questionId, content } = req.body;
    const userId = req.session.userId;

    if (!questionId || !content) {
        return res.status(400).json({ error: 'Question ID and content are required' });
    }

    // Check if question exists
    db.get('SELECT id FROM questions WHERE id = ?', [questionId], (err, question) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Insert answer
        db.run(
            'INSERT INTO answers (question_id, user_id, content) VALUES (?, ?, ?)',
            [questionId, userId, content],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error creating answer' });
                }

                res.status(201).json({
                    message: 'Answer created successfully',
                    answerId: this.lastID
                });
            }
        );
    });
});

// Mark answer as accepted (Imam only)
router.put('/:id/accept', requireImam, (req, res) => {
    const answerId = req.params.id;

    // First, get the answer to find its question_id
    db.get('SELECT question_id FROM answers WHERE id = ?', [answerId], (err, answer) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        // Unmark all other answers for this question
        db.run(
            'UPDATE answers SET is_accepted = 0 WHERE question_id = ?',
            [answer.question_id],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error updating answers' });
                }

                // Mark this answer as accepted
                db.run(
                    'UPDATE answers SET is_accepted = 1 WHERE id = ?',
                    [answerId],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Error accepting answer' });
                        }

                        res.json({ message: 'Answer marked as accepted' });
                    }
                );
            }
        );
    });
});

module.exports = router;
