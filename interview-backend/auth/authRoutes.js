
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (
        typeof name !== 'string' || !name.trim() ||
        typeof email !== 'string' || !email.trim() ||
        typeof password !== 'string' || password.length < 8 ||
        !['interviewer', 'candidate'].includes(role)
    ) {
        return res.status(400).json({
            error: 'Provide a name, valid email, password (at least 8 characters), and role (interviewer or candidate).'
        });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await pool.query(
            'SELECT id FROM "User" WHERE email = $1',
            [normalizedEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                error: 'Email is already registered.'
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const result = await pool.query(
            `INSERT INTO "User" ("name", "email", "role", "passwordHash", "createdAt")
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING id, name, email, role, "createdAt"`,
            [name.trim(), normalizedEmail, role, passwordHash]
        );

        return res.status(201).json({
            message: 'Registration successful.',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Registration failed:', error.message);
        return res.status(500).json({
            error: 'Registration failed.'
        });
    }
});

// Log in an existing user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (
        typeof email !== 'string' || !email.trim() ||
        typeof password !== 'string' || !password
    ) {
        return res.status(400).json({
            error: 'Email and password are required.'
        });
    }

    try {
        const result = await pool.query(
            `SELECT id, name, email, role, "passwordHash"
             FROM "User"
             WHERE email = $1`,
            [email.trim().toLowerCase()]
        );

        const user = result.rows[0];

        if (
            !user ||
            !user.passwordHash ||
            !(await bcrypt.compare(password, user.passwordHash))
        ) {
            return res.status(401).json({
                error: 'Invalid email or password.'
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured.');
            return res.status(500).json({
                error: 'Authentication is not configured.'
            });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login failed:', error.message);
        return res.status(500).json({
            error: 'Login failed.'
        });
    }
});

module.exports = router;
