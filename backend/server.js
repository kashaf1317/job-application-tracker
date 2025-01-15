const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: 'database', // Use "localhost" if not using Docker
    user: 'root',
    password: 'root',
    database: 'job_tracker',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL Database!');
});

// Routes

// Get all applications
app.get('/applications', (req, res) => {
    db.query('SELECT * FROM applications', (err, results) => {
        if (err) {
            console.error('Error fetching applications:', err);
            res.status(500).send('Error fetching applications');
        } else {
            res.json(results);
        }
    });
});

// Add a new application
app.post('/applications', (req, res) => {
    const { company, position, status } = req.body;
    if (!company || !position || !status) {
        return res.status(400).send('All fields are required');
    }

    db.query(
        'INSERT INTO applications (company, position, status) VALUES (?, ?, ?)',
        [company, position, status],
        (err, result) => {
            if (err) {
                console.error('Error inserting application:', err);
                res.status(500).send('Error inserting application');
            } else {
                res.status(201).json({ id: result.insertId, company, position, status });
            }
        }
    );
});

// Update application status
app.put('/applications/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.query(
        'UPDATE applications SET status = ? WHERE id = ?',
        [status, id],
        (err) => {
            if (err) {
                console.error('Error updating application:', err);
                res.status(500).send('Error updating application');
            } else {
                res.send('Application updated successfully');
            }
        }
    );
});

// Delete an application
app.delete('/applications/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM applications WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting application:', err);
            res.status(500).send('Error deleting application');
        } else {
            res.send('Application deleted successfully');
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
