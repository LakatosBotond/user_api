const express = require('express');
const routes = require('./src/routes')

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.json({status: 'OK'}));
app.use('/api', routes);

module.exports = app;