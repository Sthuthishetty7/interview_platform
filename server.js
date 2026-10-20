const express = require('express');

const app = express();
const PORT = 3000;

// Middleware to read JSON request bodies
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('Technical Interview Platform Backend is running!');
});

// Test database connection
const pool = require('./db');

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

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});