/*
 * Plant Saver
 * alert.js
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
import myAxios from './axios';

export default function getAlerts() {
    return new Promise((resolve, reject) => {
        myAxios()
            .get('/alerts')
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
}