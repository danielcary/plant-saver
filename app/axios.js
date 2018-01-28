/*
 * Plant Saver
 * axios.js
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
import axios from 'axios';

// for some reason if using the global axios object, you couldn't override the headers
// and the auth token was being passed to google map calls, which it didn't like
let myAxios = axios.create({
    baseURL: '/api'
});

export function setAuth(token) {
    myAxios = axios.create({
        baseURL: '/api',
        headers: {
            'authorization': token
        }
    });
}

export default function getAxios() {
    return myAxios;   
};
