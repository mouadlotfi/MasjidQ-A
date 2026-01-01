const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    // Validation
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['Imam', 'Parent'].includes(role)) {
        return res.status(400).json({ error: 'Role must be either Imam or Parent' });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        db.run(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Username already exists' });
                    }
                    return res.status(500).json({ error: 'Error creating user' });
                }

                res.status(201).json({
                    message: 'User registered successfully',
                    userId: this.lastID
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login user
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.userRole = user.role;

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    });
});

// Get current user
router.get('/me', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    db.get('SELECT id, username, role FROM users WHERE id = ?', [req.session.userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    });
});

// Logout user
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Change password
router.put('/password', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    db.get('SELECT * FROM users WHERE id = ?', [req.session.userId], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.session.userId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating password' });
            }

            res.json({ message: 'Password updated successfully' });
        });
    });
});

// Change username
router.put('/username', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { newUsername } = req.body;

    if (!newUsername) {
        return res.status(400).json({ error: 'New username is required' });
    }

    if (newUsername.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    db.run('UPDATE users SET username = ? WHERE id = ?', [newUsername, req.session.userId], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            return res.status(500).json({ error: 'Error updating username' });
        }

        // Update session
        req.session.username = newUsername;

        res.json({
            message: 'Username updated successfully',
            user: {
                id: req.session.userId,
                username: newUsername,
                role: req.session.userRole
            }
        });
    });
});

// Delete account
router.delete('/account', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = req.session.userId;

    // Delete user's answers
    db.run('DELETE FROM answers WHERE user_id = ?', [userId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error deleting account' });
        }

        // Delete user's questions
        db.run('DELETE FROM questions WHERE user_id = ?', [userId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error deleting account' });
            }

            // Delete user
            db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error deleting account' });
                }

                // Destroy session
                req.session.destroy((err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error logging out' });
                    }

                    res.json({ message: 'Account deleted successfully' });
                });
            });
        });
    });
});

module.exports = router;
