
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const app = express();
const PORT = process.env.PORT || 4000;
const pool = require('./db');
const mockTestRoutes = require('./mock-test/mockTestRoutes');
app.use(cors());
app.use(express.json());

app.use('/api/mock-tests', mockTestRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Technical Interview Platform Backend is running!');
});

// Check database connection
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT current_database()');

        res.json({
            status: 'success',
            message: 'Backend is running!',
            database: result.rows[0].current_database
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed'
        });
    }
});

// Create an interview
app.post('/api/interviews', async (req, res) => {
    const {
        title,
        scheduledAt,
        duration = 60,
        interviewerId,
        candidateId
    } = req.body;

    if (
        typeof title !== 'string' ||
        !title.trim() ||
        !Number.isInteger(interviewerId) ||
        !Number.isInteger(candidateId) ||
        interviewerId <= 0 ||
        candidateId <= 0 ||
        !Number.isInteger(duration) ||
        duration <= 0
    ) {
        return res.status(400).json({
            error: 'Provide a title, positive integer interviewerId and candidateId, and positive integer duration.'
        });
    }

    if (scheduledAt !== undefined && scheduledAt !== null &&
        (typeof scheduledAt !== 'string' ||
         Number.isNaN(Date.parse(scheduledAt)))) {
        return res.status(400).json({
            error: 'scheduledAt must be a valid date string or null.'
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO "Interview"
                ("title", "scheduledAt", "duration", "status",
                 "roomId", "createdAt", "interviewerId", "candidateId")
             VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
             RETURNING *`,
            [
                title.trim(),
                scheduledAt ?? null,
                duration,
                'scheduled',
                randomUUID(),
                interviewerId,
                candidateId
            ]
        );

        res.status(201).json({
            message: 'Interview created successfully',
            interview: result.rows[0]
        });
    } catch (error) {
        console.error('Create interview failed:', error.message);

        if (error.code === '23503') {
            return res.status(400).json({
                error: 'The interviewerId or candidateId does not match an existing user.'
            });
        }

        res.status(500).json({
            error: 'Could not create interview.'
        });
    }
});

// List interviews
app.get('/api/interviews', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM "Interview" ORDER BY "createdAt" DESC`
        );

        res.json({
            interviews: result.rows
        });
    } catch (error) {
        console.error('List interviews failed:', error.message);
        res.status(500).json({
            error: 'Could not retrieve interviews.'
        });
    }
});
// Get one interview by ID
app.get('/api/interviews/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Interview ID must be a positive integer.'
        });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM "Interview" WHERE "id" = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Interview not found.'
            });
        }

        res.json({ interview: result.rows[0] });
    } catch (error) {
        console.error('Get interview failed:', error.message);
        res.status(500).json({
            error: 'Could not retrieve interview.'
        });
    }
});
// Temporary: check database tables
app.get('/api/check-tables', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);

        res.json({ tables: result.rows });
    } catch (error) {
        console.error('Check tables failed:', error.message);
        res.status(500).json({
            error: 'Could not list database tables.'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
