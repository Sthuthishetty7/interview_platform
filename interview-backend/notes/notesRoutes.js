
const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Check whether the logged-in user is the assigned interviewer
async function checkInterviewer(req, res, interviewId) {
    if (req.user.role !== 'interviewer') {
        res.status(403).json({ error: 'Only interviewers can access private notes.' });
        return false;
    }

    const result = await pool.query(
        'SELECT id FROM "Interview" WHERE id = $1 AND "interviewerId" = $2',
        [interviewId, req.user.userId]
    );

    if (result.rows.length === 0) {
        res.status(404).json({ error: 'Interview not found or access denied.' });
        return false;
    }

    return true;
}

// Save a new note
router.post('/:id/notes', authMiddleware, async (req, res) => {
    const interviewId = Number(req.params.id);
    const { content } = req.body;

    if (!Number.isInteger(interviewId) || interviewId <= 0) {
        return res.status(400).json({ error: 'Invalid interview ID.' });
    }

    if (typeof content !== 'string' || !content.trim()) {
        return res.status(400).json({ error: 'Note content is required.' });
    }

    try {
        if (!(await checkInterviewer(req, res, interviewId))) return;

        const result = await pool.query(
            `INSERT INTO "Interviewer Notes" ("content", "interviewId", "createdAt")
             VALUES ($1, $2, NOW())
             RETURNING *`,
            [content.trim(), interviewId]
        );

        res.status(201).json({
            message: 'Note saved successfully.',
            note: result.rows[0]
        });
    } catch (error) {
        console.error('Save note failed:', error.message);
        res.status(500).json({ error: 'Could not save note.' });
    }
});

// Get all notes for an interview
router.get('/:id/notes', authMiddleware, async (req, res) => {
    const interviewId = Number(req.params.id);

    if (!Number.isInteger(interviewId) || interviewId <= 0) {
        return res.status(400).json({ error: 'Invalid interview ID.' });
    }

    try {
        if (!(await checkInterviewer(req, res, interviewId))) return;

        const result = await pool.query(
            `SELECT * FROM "Interviewer Notes"
             WHERE "interviewId" = $1
             ORDER BY "createdAt" DESC`,
            [interviewId]
        );

        res.json({ notes: result.rows });
    } catch (error) {
        console.error('Get notes failed:', error.message);
        res.status(500).json({ error: 'Could not retrieve notes.' });
    }
});

module.exports = router;
