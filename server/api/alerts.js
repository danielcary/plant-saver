const express = require('express');
const sql = require('mssql');
const winston = require('winston');

const router = express.Router();

// get all the alerts for the user
router.get('/', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.user.id)
        .query('SELECT Message as message FROM Alerts WHERE UserId=@Id')
        .then(results => res.json(results.recordset))
        .catch(err => {
            winston.error(err);
            res.status(500).json(err)
        });
});


module.exports = router;