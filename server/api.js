const express = require('express');
const joi = require('joi');
const sql = require('mssql');
const winston = require('winston');
const validator = require('./validator');
const auth = require('./auth');
const userIdCache = require('./userIdCache').route;
const plantsRouter = require('./api/plants');
const userRouter = require('./api/user');
const alertsRouter = require('./api/alerts');

const router = express.Router();

// check jwt token
router.use(auth);

const signupSchema = joi.object().keys({
    email: joi.string().email().required(),
    latitude: joi.number().min(-90).max(90).required(),
    longitude: joi.number().min(-180).max(180).required(),
    utcOffset: joi.number().integer().min(-12).max(12).required()
});

// sign up the user
router.post('/signup', validator(signupSchema), (req, res) => {
    new sql.Request()
        .input('Email', sql.NVarChar, req.body.email)
        .input('Latitude', sql.Decimal(6, 4), req.body.latitude)
        .input('Longitude', sql.Decimal(7, 4), req.body.longitude)
        .input('UTCOffset', sql.VarChar, req.body.utcOffset)
        .input('OAuthId', sql.NVarChar, req.user.oAuthId)
        .input('OAuthProvider', sql.NVarChar, req.user.oAuthProvider)
        .query(`IF NOT EXISTS (SELECT * FROM UserLookup WHERE OAuthId=@OAuthId)
                BEGIN
                    INSERT INTO Users (Email, Latitude, Longitude, UTCOffset) VALUES (@Email, @Latitude, @Longitude, @UTCOffset); 
                    INSERT INTO UserLookup (UserId, OAuthId, OAuthProvider) VALUES (SCOPE_IDENTITY(), @OAuthId, @OAuthProvider);
                END`)
        .then(() => res.sendStatus(201))
        .catch(err => {
            winston.error(err);
            res.status(500).json(err);
        });
});

// use middleware for converting user oauthid to internal user id
router.use(userIdCache);

// use routers
router.use('/user', userRouter);
router.use('/plants', plantsRouter);
router.use('/alerts', alertsRouter);


module.exports = router;