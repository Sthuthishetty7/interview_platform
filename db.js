require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
user: process.env.DB_USER,
host: process.env.DB_HOST,
database: process.env.DB_NAME,
password: process.env.DB_PASSWORD,
port: Number(process.env.DB_PORT)
});

pool.connect()
.then(client => {
console.log('Connected to PostgreSQL successfully');
client.release();
})
.catch(err => {
console.error('Database connection failed:', err.message);
});

module.exports = pool;