/*
 * Plant Saver
 * alerts.js
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
const CronJob = require('cron').CronJob;
const winston = require('winston');
const createAlerts = require('./alerts/createAlerts');
const clearAlerts = require('./alerts/clearalerts');


// create cron job for each utc offset
const timezone = 'Europe/Dublin';

new CronJob('0 0 0 * * *', () => timer(-6), null, true, timezone);
new CronJob('0 0 1 * * *', () => timer(-7), null, true, timezone);
new CronJob('0 0 2 * * *', () => timer(-8), null, true, timezone);
new CronJob('0 0 3 * * *', () => timer(-9), null, true, timezone);
new CronJob('0 0 4 * * *', () => timer(-10), null, true, timezone);
new CronJob('0 0 4 * * *', () => timer(14), null, true, timezone);
new CronJob('0 0 5 * * *', () => timer(-11), null, true, timezone);
new CronJob('0 0 5 * * *', () => timer(13), null, true, timezone);
new CronJob('0 0 6 * * *', () => timer(-12), null, true, timezone);
new CronJob('0 0 6 * * *', () => timer(12), null, true, timezone);
new CronJob('0 0 7 * * *', () => timer(11), null, true, timezone);
new CronJob('0 0 8 * * *', () => timer(10), null, true, timezone);
new CronJob('0 0 9 * * *', () => timer(9), null, true, timezone);
new CronJob('0 0 10 * * *', () => timer(8), null, true, timezone);
new CronJob('0 0 11 * * *', () => timer(7), null, true, timezone);
new CronJob('0 0 12 * * *', () => timer(6), null, true, timezone);
new CronJob('0 0 13 * * *', () => timer(5), null, true, timezone);
new CronJob('0 0 14 * * *', () => timer(4), null, true, timezone);
new CronJob('0 0 15 * * *', () => timer(3), null, true, timezone);
new CronJob('0 0 16 * * *', () => timer(2), null, true, timezone);
new CronJob('0 0 17 * * *', () => timer(1), null, true, timezone);
new CronJob('0 0 18 * * *', () => timer(0), null, true, timezone);
new CronJob('0 0 19 * * *', () => timer(-1), null, true, timezone);
new CronJob('0 0 20 * * *', () => timer(-2), null, true, timezone);
new CronJob('0 0 21 * * *', () => timer(-3), null, true, timezone);
new CronJob('0 0 22 * * *', () => timer(-4), null, true, timezone);
new CronJob('0 0 23 * * *', () => timer(-5), null, true, timezone);

function timer(utcOffset) {
    createAlerts(utcOffset, err => {
        winston.info(`About to create alerts for ${utcOffset}-UTC`);
        if (err) {
            winston.error(`Error creating alerts for ${utcOffset}-UTC: ${err}`);
        } else {
            winston.info(`Alerts created for ${utcOffset}-UTC!`)
            // no error so set timeout to clear alerts
            setTimeout(() => {
                winston.info(`About to clear alerts for ${utcOffset}-UTC`);
                clearAlerts(utcOffset, err => {
                    if (err) {
                        winston.error(`Error clear alerts for ${utcOffset}-UTC: ${err}`);
                    }
                    winston.info(`Alerts cleared for ${utcOffset}-UTC!`)
                })
            }, 1000 * 60 * 60 * 12);
        }
    });
}
