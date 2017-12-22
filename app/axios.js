import axios from 'axios';

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