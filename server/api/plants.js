const express = require('express');
const joi = require('joi');
const sql = require('mssql');
const validator = require('../validator');

// request validation schemas
const addUpdateSchema = joi.object().keys({
    name: joi.string().trim().min(1).max(100).required(),
    pictureId: joi.number().min(1).max(3).required(),
    temperature: joi.number().min(-99).max(99).required()
});

const router = express.Router();

// validate plantId param
router.param('plantId', (req, res, next, plantId) => {
    joi.validate(plantId, joi.number().integer(), err => {
        if (err) {
            res.status(400).json(err.details);
        } else {
            next();
        }
    });
});

// get plants
router.get('/', (req, res) => {
    new sql.Request()
        .input('OwnerId', sql.Int, req.user.id)
        .query('SELECT Id AS id, Name AS name, PictureId AS pictureId, Temperature AS temperature FROM Plants WHERE OwnerId=@OwnerId')
        .then(results => res.json(results.recordset))
        .catch(err => res.status(500).json(err));
});

// add plant
router.post('/', validator(addUpdateSchema), (req, res) => {
    new sql.Request()
        .input('OwnerId', sql.Int, req.user.id)
        .input('Name', sql.NVarChar, req.body.name.trim())
        .input('PictureId', sql.Int, req.body.pictureId)
        .input('Temperature', sql.Decimal, req.body.temperature)
        .query(`INSERT INTO Plants (OwnerId, Name, PictureId, Temperature) VALUES (@OwnerId, @Name, @PictureId, @Temperature);
                SELECT SCOPE_IDENTITY() as id;`)
        .then(results => results.json(results.recordset[0]))
        .catch(err => res.status(500).json(err));
});

// update plant
router.put('/:plantId', validator(addUpdateSchema), (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.params.plantId)
        .input('OwnerId', sql.Int, req.user.id)
        .input('Name', sql.NVarChar, req.body.name)
        .input('PictureId', sql.Int, req.body.pictureId)
        .input('Temperature', sql.Decimal, req.body.temperature)
        .query('UPDATE Plants SET Name=@Name, PictureId=@PictureId, Temperature=@Temperature WHERE Id=@Id AND OwnerId=@OwnerId;')
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err));
});

// delete plant
router.delete('/:plantId', (req, res) => {
    new sql.Request()
        .input('Id', sql.Int, req.params.plantId)
        .input('OwnerId', sql.Int, req.user.id)
        .query('DELETE FROM Plants WHERE Id=@Id AND OwnerId=@OwnerId')
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err));
});


module.exports = router;