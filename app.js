const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Hello from Docker! CI/CD via Jenkins deployed by Ihor Zinchenko',
        version: '1.0.0'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

module.exports = app;
