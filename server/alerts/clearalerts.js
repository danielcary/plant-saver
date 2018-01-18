const sql = require('mssql');

module.exports = function (utcOffset, callback) {
    new sql.Request()
        .input('UTCOffset', sql.Int, utcOffset)
        .query('DELETE FROM Alerts WHERE Alerts.UserId IN (SELECT Users.Id FROM Users WHERE Users.UTCOffset=@UTCOffset)')
        .then(() => callback())
        .catch(err => callback(err));
};