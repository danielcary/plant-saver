const express = require('express');
const sql = require('mssql');
const sendgrid = require('@sendgrid/mail');

const { getLow, makeAlerts, makeEmail } = require('./helper');

const router = express.Router();

const DARK_SKY_KEY = process.env.DARK_SKY_KEY;
sendgrid.setApiKey(process.env.SEND_GRID_KEY)

router.get('/:utcOffset', async (req, res) => {
    try {
        let lowCache = {}; // indexed by [lat,lng]
        let emails = [];
        let alerts = [];

        // Sget all the users with notifications enabled in the specified timezone
        let users = await new sql.Request()
            .input('UTCOffset', sql.Int, req.params.utcOffset)
            .query('SELECT Id as id, Email as email, ROUND(Latitude, 1) AS lat, ROUND(Longitude, 1) AS lng FROM Users WHERE UTCOffset=@UTCOffset AND NotificationsEnabled=1');
        
        for (let user of users.recordset) {
            // get all the plants for the user
            let plants = await new sql.Request()
                .input('Id', sql.Int, user.id)
                .query('SELECT Name AS name, Temperature as temp FROM Plants WHERE OwnerId=@Id');
            
            if (plants.recordset.length > 0) {
                // get the low temp for tonight
                let low = await getLow(lowCache, user.lat, user.lng);
                
                // determine which plants will be too cold
                let coldPlants = plants.recordset.filter(plant => plant.temp > low);
                
                // make an email and alerts if there will be cold plant(s)
                if (coldPlants.length > 0) {
                    emails.push(makeEmail(user.email, coldPlants))
                    alerts.push(...makeAlerts(user.id, coldPlants));
                }
            }
        }

        // send out emails
        sendgrid.sendMultiple(emails);
        
        // add alerts to database
        for (let alert of alerts) {
            await new sql.Request()
                .input('UserId', sql.Int, alert.id)
                .input('Message', sql.NVarChar, alert.message)
                .query('INSERT INTO Alerts (UserId, Message) VALUES (@UserId, @Message)')
        }

        res.sendStatus(200);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;