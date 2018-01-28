/*
 * Plant Saver
 * alerts.js
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
const CronJob = require('cron').CronJob;
const winston = require('winston');
const createAlerts = require('./alerts/clearalerts');
const clearAlerts = require('./alerts/clearalerts');


// create cron job for each utc offset
const timezone = 'Europe/Dublin';

new CronJob('0 0 0 * * *', true, timezone, () => timer(-6));
new CronJob('0 0 1 * * *', true, timezone, () => timer(-7));
new CronJob('0 0 2 * * *', true, timezone, () => timer(-8));
new CronJob('0 0 3 * * *', true, timezone, () => timer(-9));
new CronJob('0 0 4 * * *', true, timezone, () => timer(-10));
new CronJob('0 0 4 * * *', true, timezone, () => timer(14));
new CronJob('0 0 5 * * *', true, timezone, () => timer(-11));
new CronJob('0 0 5 * * *', true, timezone, () => timer(13));
new CronJob('0 0 6 * * *', true, timezone, () => timer(-12));
new CronJob('0 0 6 * * *', true, timezone, () => timer(12));
new CronJob('0 0 7 * * *', true, timezone, () => timer(11));
new CronJob('0 0 8 * * *', true, timezone, () => timer(10));
new CronJob('0 0 9 * * *', true, timezone, () => timer(9));
new CronJob('0 0 10 * * *', true, timezone, () => timer(8));
new CronJob('0 0 11 * * *', true, timezone, () => timer(7));
new CronJob('0 0 12 * * *', true, timezone, () => timer(6));
new CronJob('0 0 13 * * *', true, timezone, () => timer(5));
new CronJob('0 0 14 * * *', true, timezone, () => timer(4));
new CronJob('0 0 15 * * *', true, timezone, () => timer(3));
new CronJob('0 0 16 * * *', true, timezone, () => timer(2));
new CronJob('0 0 17 * * *', true, timezone, () => timer(1));
new CronJob('0 0 18 * * *', true, timezone, () => timer(0));
new CronJob('0 0 19 * * *', true, timezone, () => timer(-1));
new CronJob('0 0 20 * * *', true, timezone, () => timer(-2));
new CronJob('0 0 21 * * *', true, timezone, () => timer(-3));
new CronJob('0 0 22 * * *', true, timezone, () => timer(-4));
new CronJob('0 0 23 * * *', true, timezone, () => timer(-5));

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
