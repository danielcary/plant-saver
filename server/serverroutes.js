const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

// set up logger
if (!fs.existsSync(path.join(__dirname, '../logs'))) {
    fs.mkdirSync(path.join(__dirname, '../logs'))
}
winston.add(winston.transports.File, { filename: path.join(__dirname, '../logs', Date.now() + '.log'), json: false });
winston.remove(winston.transports.Console);

// get the api route
const apiRouter = require('./api');

// initialize database and alert cron jobs
require('./db');
require('./alerts');

module.exports = (app) => {
    // middleware to parse request info into JSON
    app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded
    app.use(bodyParser.json()); // application/json

    // serve static files in public folder
    app.use(express.static(path.join(__dirname, "../", "public")));

    // route our api requests
    app.use('/api', apiRouter);

    // instead of 404, redirect to index page
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "../", "public", "index.html"));
    });
};