const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection setup
const pool = new Pool({
    user: 'betatester',
    host: 'localhost',
    database: 'facility_booking',
    password: 'Sthpi9@9999',
    port: 5432,
});

// Users Endpoints
app.get('/api/users', async (req, res) => {
    const result = await pool.query('SELECT * FROM "users"');
    res.json(result.rows);
});

app.post('/api/users', async (req, res) => {
    const { name, email, password_hash, phone } = req.body;
    const result = await pool.query(
        'INSERT INTO "users" (name, email, password_hash, phone) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, password_hash, phone]
    );
    res.status(201).json(result.rows[0]);
});

app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM "users" WHERE user_id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('User not found');
    res.json(result.rows[0]);
});

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password_hash, phone } = req.body;
    const result = await pool.query(
        'UPDATE "users" SET name = $1, email = $2, password_hash = $3, phone = $4 WHERE user_id = $5 RETURNING *',
        [name, email, password_hash, phone, id]
    );
    if (result.rows.length === 0) return res.status(404).send('User not found');
    res.json(result.rows[0]);
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM "users" WHERE user_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('User not found');
    res.status(204).send();
});

// Facilities Endpoints
app.get('/api/facilities', async (req, res) => {
    const result = await pool.query('SELECT * FROM "facilities"');
    res.json(result.rows);
});

// Add other endpoints for facilities as needed...

// Bookings Endpoints
app.get('/api/bookings', async (req, res) => {
    const result = await pool.query('SELECT * FROM "bookings"');
    res.json(result.rows);
});

// Add other endpoints for bookings as needed...

// Timeslots Endpoints
app.get('/api/timeslots', async (req, res) => {
    const result = await pool.query('SELECT * FROM "timeslots"');
    res.json(result.rows);
});

// Availability Endpoints
app.get('/api/availability', async (req, res) => {
    const result = await pool.query('SELECT * FROM "availability"');
    res.json(result.rows);
});

// Payments Endpoints
app.get('/api/payments', async (req, res) => {
    const result = await pool.query('SELECT * FROM "payments"');
    res.json(result.rows);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
