const express = require('express');
require('dotenv').config({ path: "server.env" })

// create express app
const app = express();

// apply routes
require('./serverroutes')(app);

// start express server
app.listen(3000, () => console.log('Listening...'));