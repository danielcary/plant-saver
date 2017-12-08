const axios = require('axios');
const express = require('express');
const sql = require('mssql');
const sendgrid = require('@sendgrid/mail');

const router = express.Router();

const DARK_SKY_KEY = '1c944117270078b9a16dd501e39816ac';
sendgrid.setApiKey('KEY')

router.get('/:timezone', (req, res) => {
    
    let lowCache = {}; // indexed by [lat,lng]
    let emails = [];
    let alerts = [];

    // Sget all the users with notifications enabled in the specified timezone
    let users = await new sql.Request()
        .input('Timezone', sql.VarChar, req.params.timezone)
        .query('SELECT Id as id, Email as email, Latitude AS lat, Longitude AS lng FROM Users WHERE Timezone=@Timezone AND NotificationsEnabled=1');

    users.recordset.forEach(user => {
        // get all the plants for the user
        let plants = await new sql.Request()
            .input('Id', sql.Int, user.id)
            .query('SELECT Name AS name, Temperature as temp FROM Plants WHERE OwnerId=@Id');

        if (plants.recordset.length > 0) {
            // get the low temp for tonight
            let low = await getLow(lowCache, user.lat, user.lng);

            // determine which plants will be too cold
            let coldPlants = plants.filter(plant => plant.temp > low);

            // make an email and alerts if there will be cold plant(s)
            if (coldPlants.length > 0) {
                emails.push(makeEmail(user.email, coldPlants))
                alerts.push(...makeAlerts(user.id, coldPlants));
            }
        }
    });

    // send out emails
    sendgrid.sendMultiple(emails);

    // add alerts to database
    alerts.forEach(alert => {
        await new sql.Request()
            .input('Id', sql.Int, alert.id)
            .input('Message', sql.NVarChar, alert.message)
            .query('INSERT INTO Alerts (UserId, Message) VALUES (@Id, @Message)')
    });
});

function makeEmail(email, plants) {
    let messageContent = 'It is going to be too cold for ';

    switch (plants.length) {
        case 1:
            messageContent += `${plants[0].name} tonight!`;
            break;
        case 2:
            messageContent += `${plants[0].name} and ${plants[1].name} tonight!`;
            break;
        case 3:
            messageContent += `${plants[0].name}`;
            for (let i = 1; i < plants.length - 1; i++) {
                messageContent += `, ${plants[i].name}`;
            }
            messageContent += `, and ${plants[plants.length - 1].name} tonight!`;
            break;
    }

    return {
        to: email,
        from: 'alert@plantsaver.danielcary.com',
        subject: "It's Going to be Cold Tonight",
        text: messageContent,
        html: messageContent
    };
}

function makeAlerts(id, plants) {
    return plants.map(plant => {
        return {
            id: id,
            message: `It is going to be too cold for ${plant.name} tonight!`
        }
    });
}

function getLow(cache, lat, lng) {
    return new Promise((resolve, reject) => {

        if (cache[`${lat},${lng}`]) {
            resolve(cache[`${lat},${lng}`]);
        } else {
            axios.get(`https://api.darksky.net/forecast/${DARK_SKY_KEY}/${lat},${lng}`, {
                params: { exclude: 'currently,minutely,daily,alerts,flags' }
            }).then(res => {
                let low = res.data.hourly.data[0].temperature;

                for (let i = 1; i < 14; i++) {
                    if (low > res.data.hourly.data[i].temperature) {
                        low = res.data.hourly.data[i].temperature;
                    }
                }

                cache[`${lat},${lng}`] = low;
                resolve(low);
            }).catch(err => reject(err));
        }
    });
}


module.exports = router;