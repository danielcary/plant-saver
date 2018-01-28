/*
 * Plant Saver
 * auth.js
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
const axios = require('axios');
const jws = require('jws');
const getPem = require('rsa-pem-from-mod-exp');
const winston = require('winston');

const CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const MY_AUD = process.env.GOOGLE_OAUTH_AUD;

let keys = {};

function getKey(kid) {
    return new Promise((resolve, reject) => {
        if (keys[kid]) {
            resolve(keys[kid]);
        } else {
            axios.get(CERTS_URL).then(res => {
                keys = {};
                res.data.keys.forEach(key => {
                    keys[key.kid] = key
                });
                resolve(keys[kid]);
            });
        }
    });
}

module.exports = function (req, res, next) {
    let authHeader = req.header('Authorization');
    if (authHeader == null || !authHeader.startsWith('Bearer')) {
        res.status(401).send('Missing JWT')
    } else {
        // decode token
        let token = authHeader.substring('Bearer '.length);

        let jwt = jws.decode(token);
        jwt.payload = JSON.parse(jwt.payload);

        // verify payload claims
        if (jwt.payload.aud != MY_AUD) {
            res.status(401).send('Bad JWT')
            return;
        }

        if (jwt.payload.iss != 'accounts.google.com' && jwt.payload.iss != 'https://accounts.google.com') {
            res.status(401).send('Bad JWT')
            return;
        }

        // verify signature
        getKey(jwt.header.kid).then(key => {
            // construct public key
            let pem = getPem(key.n, key.e);

            // verify contents            
            if(jws.verify(token, key.alg, pem)) {

                // set user info
                req.user = {
                    oAuthId: `G-${jwt.payload.sub}`,
                    oAuthProvider: 'Google',
                    email: jwt.payload.email,
                    name: jwt.payload.name
                };

                next();
            } else {
                res.status(401).send('Bad JWT');
            }
        }).catch(err => {
            winston.error(err);
            res.sendStatus(500);
        });
    }
};