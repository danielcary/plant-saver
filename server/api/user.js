const express = require('express');
const joi = require('joi');
const sql = require('mssql');
const validator = require('../validator');

// update validation schemas
const settingsSchema = joi.object().keys({
    email: joi.string().email().required(),
    notificationsEnabled: joi.bool().required(),
    useFahrenheit: joi.bool().required()
});

const locationSchema = joi.object().keys({
    latitude: joi.number().min(-90).max(90).required(),
    longitude: joi.number().min(-180).max(180).required(),
    timezone: joi.string().required()
});

const router = express.Router();

// get account settings
router.get('/', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.user.id)
        .query('SELECT Email AS email, NotificationsEnabled AS notificationsEnabled, UseFahrenheit AS useFahrenheit, Latitude AS latitude, Longitude AS longitude, Timezone AS timezone FROM Users WHERE Id=@Id')
        .then(results => res.json(results.recordset[0]))
        .catch(err => res.status(500).json(err));
});

// update account settings
router.put('/settings', validator(settingsSchema), (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.user.id)
        .input('Email', sql.VarChar, req.body.email)
        .input('NotificationsEnabled', sql.Bit, req.body.notificationsEnabled)
        .input('UseFahrenheit', sql.Bit, req.body.useFahrenheit)
        .query('UPDATE Users SET Email=@Email, NotificationsEnabled=@NotificationsEnabled, UseFahrenheit=@UseFahrenheit WHERE Id=@Id')
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err));
});

// update location
router.put('/location', validator(locationSchema), (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.user.id)
        .input('Latitude', sql.Decimal, req.body.latitude)
        .input('Longitude', sql.Decimal, req.body.longitude)
        .input('Timezone', sql.VarChar, req.body.timezone)
        .query('UPDATE Users SET Latitude=@Latitude, Longitude=@Longitude, Timezone=@Timezone WHERE Id=@Id')
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