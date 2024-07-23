// const express = require('express');
// const mysql = require('mysql2');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

// const app = express();
// const port = 3000;

// // Database Connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Jasweer@123',
//     database: 'food_guardian'
// });

// db.connect(err => {
//     if (err) throw err;
//     console.log('Database connected...');
// });

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// // Register Route
// app.post('/register', (req, res) => {
//     const { email, password, name } = req.body;
//     const hashedPassword = bcrypt.hashSync(password, 8);
//     const sql = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';
//     db.query(sql, [email, hashedPassword, name], (err, result) => {
//         if (err) return res.status(500).send('Error registering user');
//         res.status(201).send('User registered successfully');
//     });
// });

// // Login Route
// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     const sql = 'SELECT * FROM users WHERE email = ?';
//     db.query(sql, [email], (err, results) => {
//         if (err) return res.status(500).send('Error logging in');
//         if (results.length > 0) {
//             const user = results[0];
//             const passwordIsValid = bcrypt.compareSync(password, user.password);
//             if (passwordIsValid) {
//                 const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '1h' });
//                 res.json({ auth: true, token });
//             } else {
//                 res.status(401).send('Invalid password');
//             }
//         } else {
//             res.status(404).send('User not found');
//         }
//     });
// });

// // Donations Route
// app.post('/donate', (req, res) => {
//     const { userId, amount, donationType } = req.body;
//     const sql = 'INSERT INTO donations (user_id, amount, donation_type) VALUES (?, ?, ?)';
//     db.query(sql, [userId, amount, donationType], (err, result) => {
//         if (err) return res.status(500).send('Error recording donation');
//         res.status(201).send('Donation recorded');
//     });
// });

// // Volunteer Route
// app.post('/volunteer', (req, res) => {
//     const { userId, opportunityId } = req.body;
//     const sql = 'INSERT INTO volunteer_signups (user_id, opportunity_id) VALUES (?, ?)';
//     db.query(sql, [userId, opportunityId], (err, result) => {
//         if (err) return res.status(500).send('Error recording signup');
//         res.status(201).send('Signup recorded');
//     });
// });

// // Get Food Assistance Route
// app.post('/get-food', (req, res) => {
//     const { name, email, address, phone } = req.body;
//     const sql = 'INSERT INTO food_requests (name, email, address, phone) VALUES (?, ?, ?, ?)';
//     db.query(sql, [name, email, address, phone], (err, result) => {
//         if (err) return res.status(500).send('Error processing request');
//         res.status(201).send('Food assistance request submitted');
//     });
// });

// // Start Server
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });
