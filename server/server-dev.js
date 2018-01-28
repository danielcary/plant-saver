/*
 * Plant Saver
 * server-dev.js
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
const express = require('express');
require('dotenv').config({ path: "server.env" })

// create express app
const app = express();

// apply routes
require('./serverroutes')(app);

// start express server
app.listen(3000, () => console.log('Listening...'));