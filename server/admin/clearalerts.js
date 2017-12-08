const express = require('express');
const sql = require('mssql');

const router = express.Router();

router.get('/:utcOffset', (req, res) => {
    new sql.Request()
        .input('UTCOffset', sql.Int, req.params.utcOffset)
        .query('DELETE FROM Alerts WHERE Alerts.UserId IN (SELECT Users.Id FROM Users WHERE Users.UTCOffset=@UTCOffset)')
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err));
});


module.exports = router;