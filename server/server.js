const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config()

const db = require('./db');
const apiRouter = require('./api');
const adminRouter = require('./admin');

// credentials for the https server
const credentials = {
    key: fs.readFileSync('sslcert/server.key', 'utf8'),
    cert: fs.readFileSync('sslcert/server.crt', 'utf8')
};

const app = express();

// middleware to parse request info into JSON
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

// serve static files in public folder
app.use(express.static(path.join(__dirname, "../", "public")));

// route our api requests
app.use('/api', apiRouter);
app.use('/admin', adminRouter);

// instead of 404, redirect to index page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../", "public", "index.html"));
});

// start https server
https.createServer(credentials, app).listen(443);