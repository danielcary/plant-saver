import axios from './axios';

/* {
    id: number;
    name: string;
    temperature: number;
    pictureId: number;
} */
let plants = [];

export function loadPlants() {
    return new Promise((resolve, reject) => {
        axios.get('/plants').then(res => {
            plants = res.data;
            console.log(plants);

            resolve(plants);
        }).catch(err => reject(err));
    });
}

export function getPlants() {
    return plants;
}

export function addPlant(name, pictureId, temperature) {
    return new Promise((resolve, reject) => {
        axios.post('/plants', {
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
        axios.put(`/plants/${id}`, {
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
        axios.delete(`/plants/${id}`).then(res => {
            // update local list
            plants = plants.filter(plant => plant.id != id);
            resolve(plants);
        }).catch(err => reject(err));
    });
}

export const plantPicUrls = {
    1: "http://lohitsascience.weebly.com/uploads/2/2/6/0/22607136/622994_orig.jpg",
    2: "http://www.ikea.com/gb/en/images/products/dracaena-marginata-potted-plant-dragon-tree-1-stem__0112750_pe264649_s5.jpg",
    3: "http://www.homedepot.com/catalog/productImages/1000/a3/a3406ed8-0d2a-427d-b7ea-80cdc5502454_1000.jpg"
};