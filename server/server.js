const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const ocsp = require('ocsp');
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
let httpsServer = https.createServer(credentials, app);

let ocspCache = new ocsp.Cache();

httpsServer.on('OCSPRequest', (cert, issuer, cb) => {
    ocsp.getOCSPURI(cert, (err, uri) => {
        if (err) {
            return cb(err);
        }
        if (uri === null) {
            return cb();
        }

        var req = ocsp.request.generate(cert, issuer);
        ocspCache.probe(req.id, (err, cached) => {
            if (err) {
                return cb(err);
            }
            if (cached !== false) {
                return cb(null, cached.response);
            }

            var options = {
                url: uri,
                ocsp: req.data
            };

            ocspCache.request(req.id, options, cb);
        });
    });
});


httpsServer.listen(443);
