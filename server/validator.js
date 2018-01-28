/*
 * Plant Saver
 * validator.js
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
const joi = require('joi');

module.exports = function (bodySchema) {
    return (req, res, next) => {
        joi.validate(req.body, bodySchema, (err, val) => {
            if (!err) {
                req.body = val;
                next()
            } else {
                res.status(400).json(err.details);
            }
        });
    }
};