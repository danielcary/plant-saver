/*
 * Plant Saver
 * useridcache.js
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
const sql = require('mssql');

let idCache = {};

module.exports.removeId = function(oAuthId) {
    delete idCache[oAuthId];
}

// convert id from OAuth id to internal id
module.exports.route = function (req, res, next) {
    // check cache first
    if (idCache[req.user.oAuthId]) {
        req.user.id = idCache[req.user.oAuthId];
        next();
    } else {
        // look up in db
        new sql.Request()
            .input('OAuthId', sql.VarChar, req.user.oAuthId)
            .query('SELECT UserId AS id FROM UserLookup WHERE OAuthId=@OAuthId')
            .then(results => {
                if (results.recordset.length == 1) {
                    let id = results.recordset[0].id;
                    idCache[req.user.oAuthId] = id;
                    req.user.id = id;
                    next();
                } else {
                    res.status(401).send('No User');
                }
            }).catch(err => next(err));
    }
};
