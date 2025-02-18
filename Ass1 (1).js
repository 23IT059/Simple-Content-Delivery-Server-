const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;


app.use((req, res, next) => {
    const logEntry = `${new Date().toISOString()} - ${req.ip}\n`;
    fs.appendFileSync('visits.log', logEntry);
    next();
});



// API to retrieve logs
app.get('/logs', (req, res) => {
    fs.readFile('visits.log', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read log file' });
        }
        const logs = data.split('\n').filter(entry => entry).map(entry => {
            const [timestamp, ip] = entry.split(' - ');
            return { timestamp, ip };
        });
        res.json(logs);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
