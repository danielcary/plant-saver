const express = require('express');
const joi = require('joi');
const sql = require('mssql');
const validator = require('../validator');

// update schema
let updateSchema = joi.object().keys({
    email: joi.string().email().required(),
    notificationsEnabled: joi.bool().required(),
    locationId: joi.number().integer().min(1).required(),
    useFahrenheit: joi.bool().required()
});

let router = express.Router();

// get account settings
router.get('/', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.user.id)
        .query(`SELECT Email AS email, NotificationsEnabled AS notificationsEnabled, 
                    UseFahrenheit AS useFahrenheit, LocationId AS locationId, FormattedAddress AS address
                FROM Users
                INNER JOIN Locations ON Locations.Id = Users.LocationId
                WHERE Id=@Id`)
        .then(results => res.json(results.recordset[0]))
        .catch(err => res.status(500).json(err));
});

// update account settings
router.put('/', validator(updateSchema), (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.user.id)
        .input('Email', sql.VarChar, req.body.email)
        .input('NotificationsEnabled', sql.Bit, req.body.notificationsEnabled)
        .input('LocationId', sql.Int, req.body.locationId)
        .input('UseFahrenheit', sql.Bit, req.body.useFahrenheit)
        .query(`UPDATE Users 
                SET Email=@Email, NotificationsEnabled=@NotificationsEnabled, LocationId=@LocationId, UseFahrenheit=@UseFahrenheit
                WHERE Id=@Id`)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err));
});

// delete account
router.delete('/', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.user.int)
        .query(`DELETE FROM UserLookup WHERE UserId=@Id;
                DELETE FROM Users WHERE Id=@Id`)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err));
});


module.exports = router;