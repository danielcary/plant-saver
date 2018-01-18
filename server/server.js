const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
require('dotenv').config()

// create express app
const app = express();

// force https
app.use((req, res, next) => {
    if (req.secure) {
        next()
    } else {
        res.redirect('https://' + req.hostname + req.url);
    }
});

// apply routes
require('./serverroutes')(app);

// credentials for the https server
const credentials = {
    key: fs.readFileSync(process.env.SSL_SERVER_KEY_PATH, 'utf8'),
    cert: fs.readFileSync(process.env.SSL_SERVER_CERT_PATH, 'utf8')
};

// start both servers
http.createServer(app).listen(80);
https.createServer(credentials, app).listen(443);