const express = require('express');
const sql = require('mssql');

const router = express.Router();

router.get('/:timezone', (req, res) => {
    new sql.Request()
        .input('Timezone', sql.VarChar, req.params.timezone)
        .query('DELETE FROM Alerts WHERE Alerts.UserId IN (SELECT Users.Id FROM Users WHERE Users.Timezone=@Timezone)')
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err));
});


module.exports = router;