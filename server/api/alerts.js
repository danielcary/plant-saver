const express = require('express');
const sql = require('mssql');

const router = express.Router();

// get all the alerts for the user
router.get('/', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.user.id)
        .query('SELECT Content FROM Alerts WHERE UserId=@Id')
        .then(results => res.json(results.recordset))
        .catch(err => res.status(500).json(err));
});


module.exports = router;