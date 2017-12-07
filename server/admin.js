const express = require('express');

const clearAlertsRouter = require('./admin/clearalerts');
const createAlertsRouter = require('./admin/createalerts');

const ADMIN_KEY = 'test';

const router = express.Router();

// verify admin key
router.use((req, res, next) => {
    if (req.body.key == 'test') {
        next();
    } else {
        res.sendStatus(401);
    }
});

// use routers
router.use('/clearalerts', clearAlertsRouter);
router.use('/createalerts', createAlertsRouter);


module.exports = router;