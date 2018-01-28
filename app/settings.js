/*
 * Plant Saver
 * settings.js
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
import axios from './axios';

let settings = null;

export function login() {
    return new Promise((resolve, reject) => {
        axios()
            .get('/user')
            .then(res => resolve(settings = res.data))
            .catch(err => reject(err))
    });
}

export function get() {
    return settings;
};

export function clear() {
    settings = null;
}

export function updateSettings(newSettings) {
    return new Promise((resolve, reject) => {
        axios()
            .put('/user/settings', newSettings)
            .then(res => resolve(settings = Object.assign({}, newSettings)))
            .catch(err => reject(err));
    });
};

export function deleteAccount() {
    return new Promise((resolve, reject) => {
        axios().delete('/user')
            .then(res => {
                settings = null;
                resolve();
            }).catch(err => reject(err));
    });
}