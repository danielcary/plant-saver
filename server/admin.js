const express = require('express');

const clearAlertsRouter = require('./admin/clearalerts');
const createAlertsRouter = require('./admin/createalerts');

const router = express.Router();

// verify admin key
router.use((req, res, next) => {
    if (req.headers.admin_key == process.env.ADMIN_KEY) {
        next();
    } else {
        res.sendStatus(401);
    }
});

// use routers
router.use('/clearalerts', clearAlertsRouter);
router.use('/createalerts', createAlertsRouter);


module.exports = router;