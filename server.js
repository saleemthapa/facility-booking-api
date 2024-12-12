const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection setup using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Facility Booking API!');
});

// Users Endpoints
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "users"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { name, email, password_hash, phone } = req.body;
        const result = await pool.query(
            'INSERT INTO "users" (name, email, password_hash, phone) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, password_hash, phone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Other endpoints (same as your code) ...

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
