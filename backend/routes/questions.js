const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/middleware');
const router = express.Router();

// Get all questions with their answers
router.get('/', (req, res) => {
    const query = `
    SELECT 
      q.id,
      q.title,
      q.content,
      q.tags,
      q.created_at,
      u.id as user_id,
      u.username,
      u.role as user_role
    FROM questions q
    JOIN users u ON q.user_id = u.id
    ORDER BY q.created_at DESC
  `;

    db.all(query, [], (err, questions) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching questions' });
        }

        // Get answers for each question
        const questionIds = questions.map(q => q.id);
        if (questionIds.length === 0) {
            return res.json({ questions: [] });
        }

        const answerQuery = `
      SELECT 
        a.id,
        a.question_id,
        a.content,
        a.is_accepted,
        a.created_at,
        u.id as user_id,
        u.username,
        u.role as user_role
      FROM answers a
      JOIN users u ON a.user_id = u.id
      WHERE a.question_id IN (${questionIds.join(',')})
      ORDER BY a.is_accepted DESC, a.created_at ASC
    `;

        db.all(answerQuery, [], (err, answers) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching answers' });
            }

            // Group answers by question
            const questionsWithAnswers = questions.map(question => ({
                ...question,
                answers: answers.filter(a => a.question_id === question.id)
            }));

            res.json({ questions: questionsWithAnswers });
        });
    });
});

// Get single question with answers
router.get('/:id', (req, res) => {
    const questionId = req.params.id;

    const questionQuery = `
    SELECT 
      q.id,
      q.title,
      q.content,
      q.tags,
      q.created_at,
      u.id as user_id,
      u.username,
      u.role as user_role
    FROM questions q
    JOIN users u ON q.user_id = u.id
    WHERE q.id = ?
  `;

    db.get(questionQuery, [questionId], (err, question) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching question' });
        }

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Get answers for this question
        const answerQuery = `
      SELECT 
        a.id,
        a.content,
        a.is_accepted,
        a.created_at,
        u.id as user_id,
        u.username,
        u.role as user_role
      FROM answers a
      JOIN users u ON a.user_id = u.id
      WHERE a.question_id = ?
      ORDER BY a.is_accepted DESC, a.created_at ASC
    `;

        db.all(answerQuery, [questionId], (err, answers) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching answers' });
            }

            res.json({
                question: {
                    ...question,
                    answers
                }
            });
        });
    });
});

// Create new question (authenticated users only)
router.post('/', requireAuth, (req, res) => {
    const { title, content, tags } = req.body;
    const userId = req.session.userId;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    // Tags should be a comma-separated string
    const tagsString = tags || '';

    db.run(
        'INSERT INTO questions (user_id, title, content, tags) VALUES (?, ?, ?, ?)',
        [userId, title, content, tagsString],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Error creating question' });
            }

            res.status(201).json({
                message: 'Question created successfully',
                questionId: this.lastID
            });
        }
    );
});

// Delete question (question owner only)
router.delete('/:id', requireAuth, (req, res) => {
    const questionId = req.params.id;
    const userId = req.session.userId;

    // Check if question exists and user is the owner
    db.get('SELECT * FROM questions WHERE id = ?', [questionId], (err, question) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        if (question.user_id !== userId) {
            return res.status(403).json({ error: 'You can only delete your own questions' });
        }

        // Delete answers first (foreign key constraint)
        db.run('DELETE FROM answers WHERE question_id = ?', [questionId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error deleting question' });
            }

            // Delete question
            db.run('DELETE FROM questions WHERE id = ?', [questionId], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error deleting question' });
                }

                res.json({ message: 'Question deleted successfully' });
            });
        });
    });
});

module.exports = router;
