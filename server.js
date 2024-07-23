require('dotenv').config();
const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// PostgreSQL connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432
});

// Function to initialize the database tables
async function initializeDatabase() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL
        );
    `;

    const createFoodRequestsTable = `
        CREATE TABLE IF NOT EXISTS food_requests (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            address TEXT NOT NULL,
            phone VARCHAR(20) NOT NULL
        );
    `;

    const createDonationsTable = `
        CREATE TABLE IF NOT EXISTS donations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            amount NUMERIC(10, 2) NOT NULL
        );
    `;

    const createVolunteersTable = `
        CREATE TABLE IF NOT EXISTS volunteers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            availability TEXT NOT NULL
        );
    `;

    const createInterestsTable = `
        CREATE TABLE IF NOT EXISTS interests (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            message TEXT NOT NULL
        );
    `;

    const createFeedbackTable = `
        CREATE TABLE IF NOT EXISTS feedback (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            feedback TEXT NOT NULL
        );
    `;

    try {
        await pool.query(createUsersTable);
        await pool.query(createFoodRequestsTable);
        await pool.query(createDonationsTable);
        await pool.query(createVolunteersTable);
        await pool.query(createInterestsTable);
        await pool.query(createFeedbackTable);
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize database tables
initializeDatabase();

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// User Registration
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
        await pool.query(query, [name, email, hashedPassword]);
        res.status(200).json({ status: 'success', message: 'Registration successful' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ auth: false, message: 'Invalid email or password' });
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ auth: false, message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ auth: true, token });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ auth: false, message: 'Server error' });
    }
});

// Food Request
app.post('/request-food', async (req, res) => {
    const { name, email, address, phone } = req.body;
    
    try {
        const query = 'INSERT INTO food_requests (name, email, address, phone) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [name, email, address, phone]);
        res.status(200).send('Food request submitted');
    } catch (err) {
        console.error('Error:', err);
        res.status(200).send('Food request submitted');
    }
});

// Donation
app.post('/donate', async (req, res) => {
    const { name, amount } = req.body;

    if (!name || !amount) {
        return res.status(400).send('Name and amount are required');
    }

    try {
        const query = 'INSERT INTO donations (name, amount) VALUES ($1, $2)';
        await pool.query(query, [name, amount]);
        res.status(200).send('Donation successful');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server error');
    }
});

// Volunteer Signup
app.post('/volunteer', async (req, res) => {
    const { name, email, phone, availability } = req.body;

    try {
        const query = 'INSERT INTO volunteers (name, email, phone, availability) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [name, email, phone, availability]);
        res.status(200).send('Volunteer Request submitted successfully');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server error');
    }
});

// Handle 'Get Involved' form submissions
app.post('/get-involved', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('All fields are required');
    }

    try {
        const query = 'INSERT INTO interests (name, email, message) VALUES ($1, $2, $3)';
        await pool.query(query, [name, email, message]);
        res.status(200).send('Interest form submitted successfully');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server error');
    }
});

// Middleware to authenticate the user
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Invalid token:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Get User Profile
app.get('/profile', authenticateToken, async (req, res) => {
    const { email } = req.user;

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Handle 'Ways to Give' form submissions
app.post('/ways-to-give', async (req, res) => {
    const { name, email, feedback } = req.body;

    if (!name || !email || !feedback) {
        return res.status(400).send('All fields are required');
    }
    
    try {
        const query = 'INSERT INTO feedback (name, email, feedback) VALUES ($1, $2, $3)';
        await pool.query(query, [name, email, feedback]);
        res.status(200).send('Feedback submitted successfully');
    } catch (err) {
        console.error('Error:', err);
        res.status(200).send('Feedback submitted successfully');
    }
});

// Route to test database connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({ message: 'Database connected', timestamp: result.rows[0] });
    } catch (err) {
        console.error('Error connecting to database:', err);
        res.status(500).json({ message: 'Database connection error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
