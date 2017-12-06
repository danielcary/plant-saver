const joi = require('joi');

module.exports = function (bodySchema) {
    return (req, res, next) => {
        joi.validate(req.body, schema, (err, val) => {
            if (!err) {
                req.body = val;
                next()
            } else {
                res.status(400).json(err.details);
            }
        });
    }
};