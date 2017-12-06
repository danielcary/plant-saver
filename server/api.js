const express = require('express');
const sql = require('mssql');

const auth = require('./auth');
// routes
const plantsRouter = require('./api/plants');
const userRouter = require('./api/user');

const router = express.Router();

// check jwt token
router.use(auth);

// sign up
router.post('/signup', (req, res) => {

    // validate request
    // TODO

    // create an account for the user
    new sql.Request()
        .input('Email', sql.VarChar, req.body.email)
        .input('LocationId', sql.Int, req.body.locationId)
        .input('UseFahrenheit', sql.Bit, req.body.useFahrenheit)
        .input('OAuthId', sql.VarChar, req.user.id)
        .input('OAuthProvider', sql.NVarChar, req.user.oAuthProvider)
        .query(`INSERT INTO Users (Email, Phone, SMSNotifications, LocationId, UseFahrenheit)
                    VALUES (@Email, @Phone, @SMSNotifications, @LocationId, @UseFahrenheit); 
                INSERT INTO UserLookup (UserId, OAuthId, OAuthProvider) 
                    VALUES (SCOPE_IDENTITY(), @OAuthId, @OAuthProvider);`)
        .then(() => res.sendStatus(201));
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
                    res.sendStatus(401);
                }
            }).catch(err => next(err));
    }
});

// use routers
app.use('/user', userRouter);
app.use('/plants', plantsRouter);


module.exports = router;