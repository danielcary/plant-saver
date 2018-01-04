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

export function convert(temp) {
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
    1: "http://lohitsascience.weebly.com/uploads/2/2/6/0/22607136/622994_orig.jpg",
    2: "http://www.ikea.com/gb/en/images/products/dracaena-marginata-potted-plant-dragon-tree-1-stem__0112750_pe264649_s5.jpg",
    3: "http://www.homedepot.com/catalog/productImages/1000/a3/a3406ed8-0d2a-427d-b7ea-80cdc5502454_1000.jpg"
};