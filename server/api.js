const express = require('express');

const auth = require('./auth');

const router = express.Router();

router.use(auth);

router.use('/', (req, res) => {
    console.log(req.user);
    res.sendStatus(200)
});


module.exports = router;