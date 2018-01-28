/*
 * Plant Saver
 * plant.js
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
import myAxios from './axios';
import * as settings from './settings';

let plants = [];

export function loadPlants() {
    return new Promise((resolve, reject) => {
        myAxios().get('/plants')
            .then(res => resolve(plants = res.data))
            .catch(err => reject(err));
    });
}

export function getPlants() {
    return plants;
}

export function addPlant(name, pictureId, temperature) {
    return new Promise((resolve, reject) => {
        myAxios().post('/plants', {
            name: name,
            pictureId: pictureId,
            temperature: temperature
        }).then(res => {
            plants.push({
                id: res.data.id,
                name: name,
                pictureId: pictureId,
                temperature: temperature
            });
            resolve(plants);
        }).catch(err => reject(err));
    });
}

export function editPlant(id, name, pictureId, temperature) {
    return new Promise((resolve, reject) => {
        myAxios().put(`/plants/${id}`, {
            name: name,
            pictureId: pictureId,
            temperature: temperature
        }).then(res => {
            // update local list
            for (let i = 0; i < plants.length; i++) {
                if (plants[i].id == id) {
                    plants[i].name = name;
                    plants[i].pictureId = pictureId;
                    plants[i].temperature = temperature;
                    break;
                }
            }
            resolve(plants);
        }).catch(err => reject(err));
    });
}

export function removePlant(id) {
    return new Promise((resolve, reject) => {
        myAxios().delete(`/plants/${id}`).then(res => {
            // update local list
            plants = plants.filter(plant => plant.id != id);
            resolve(plants);
        }).catch(err => reject(err));
    });
}

export function convertForDisplay(temp) {
    if (settings.get().useFahrenheit) {
        return temp;
    } else {
        return Math.round(((temp - 32) * (5 / 9)) * 10) / 10;
    }
}

export function convertForSaving(temp) {
    if (settings.get().useFahrenheit) {
        return temp;
    } else {
        return Math.round((temp * (9 / 5) + 32) * 10) / 10;
    }
}

export function degreeType() {
    return settings.get().useFahrenheit ? 'F' : 'C';
}

export const plantPicUrls = {
    1: "/images/plant1.png",
    2: "/images/plant2.png",
    3: "/images/plant3.png",
    4: "/images/plant4.png"
};