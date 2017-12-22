const express = require('express');
const joi = require('joi');
const sql = require('mssql');

const validator = require('./validator');
const auth = require('./auth');
const plantsRouter = require('./api/plants');
const userRouter = require('./api/user');

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
        .input('Latitude', sql.Decimal, req.body.latitude)
        .input('Longitude', sql.Decimal, req.body.longitude)
        .input('UTCOffset', sql.VarChar, req.body.utcOffset)
        .input('OAuthId', sql.NVarChar, req.user.id)
        .input('OAuthProvider', sql.NVarChar, req.user.oAuthProvider)
        .query(`IF NOT EXISTS (SELECT * FROM UserLookup WHERE OAuthId=@OAuthId)
                BEGIN
                    INSERT INTO Users (Email, Latitude, Longitude, UTCOffset) VALUES (@Email, @Latitude, @Longitude, @UTCOffset); 
                    INSERT INTO UserLookup (UserId, OAuthId, OAuthProvider) VALUES (SCOPE_IDENTITY(), @OAuthId, @OAuthProvider);
                END`)
        .then(() => res.sendStatus(201))
        .catch(err => res.status(500).json(err));
});

// convert id from OAuth id to internal id
let idCache = {};

router.use((req, res, next) => {
    // check cache first
    if (idCache[req.user.id]) {
        req.user.id = idCache[req.user.id];
        next();
    } else {
        // look up in db
        new sql.Request()
            .input('Id', sql.VarChar, req.user.id)
            .query('SELECT UserId AS id FROM UserLookup WHERE OAuthId=@Id')
            .then(results => {
                if (results.recordset.length == 1) {
                    let id = results.recordset[0].id;
                    idCache[req.user.id] = id;
                    req.user.id = id;
                    next();
                } else {
                    res.status(401).send('No User');
                }
            }).catch(err => next(err));
    }
});

// use routers
router.use('/user', userRouter);
router.use('/plants', plantsRouter);


module.exports = router;