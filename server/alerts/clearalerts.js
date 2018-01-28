/*
 * Plant Saver
 * clearalerts.js
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
const sql = require('mssql');

module.exports = function (utcOffset, callback) {
    new sql.Request()
        .input('UTCOffset', sql.Int, utcOffset)
        .query('DELETE FROM Alerts WHERE Alerts.UserId IN (SELECT Users.Id FROM Users WHERE Users.UTCOffset=@UTCOffset)')
        .then(() => callback())
        .catch(err => callback(err));
};