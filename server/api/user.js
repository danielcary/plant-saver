const express = require('express');
const joi = require('joi');
const sql = require('mssql');
const validator = require('../validator');
const removeFromUserIdCache = require('../userIdCache').removeId;

// update validation schemas
const settingsSchema = joi.object().keys({
    email: joi.string().email().required(),
    notificationsEnabled: joi.bool().required(),
    useFahrenheit: joi.bool().required(),
    latitude: joi.number().min(-90).max(90).required(),
    longitude: joi.number().min(-180).max(180).required(),
    utcOffset: joi.number().integer().min(-12).max(12).required()
});

const router = express.Router();

// get account settings
router.get('/', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.user.id)
        .query('SELECT Email AS email, NotificationsEnabled AS notificationsEnabled, UseFahrenheit AS useFahrenheit, Latitude AS latitude, Longitude AS longitude, UTCOffset AS utcOffset FROM Users WHERE Id=@Id')
        .then(results => res.json(results.recordset[0]))
        .catch(err => res.status(500).json(err));
});

// update account settings
router.put('/settings', validator(settingsSchema), (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.user.id)
        .input('Email', sql.NVarChar, req.body.email)
        .input('NotificationsEnabled', sql.Bit, req.body.notificationsEnabled)
        .input('UseFahrenheit', sql.Bit, req.body.useFahrenheit)
        .input('Latitude', sql.Decimal(6, 4), req.body.latitude)
        .input('Longitude', sql.Decimal(7, 4), req.body.longitude)
        .input('UTCOffset', sql.Int, req.body.utcOffset)
        .query('UPDATE Users SET Email=@Email, NotificationsEnabled=@NotificationsEnabled, UseFahrenheit=@UseFahrenheit, Latitude=@Latitude, Longitude=@Longitude, UTCOffset=@UTCOffset WHERE Id=@Id')
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err));
});

// delete account
router.delete('/', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.user.id)
        .query('DELETE FROM Users WHERE Id=@Id')
        .then(() => removeFromUserIdCache(req.user.oAuthId))
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err));
});


module.exports = router;