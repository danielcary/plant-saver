import myAxios from './axios';


export default function getAlerts() {
    return new Promise((resolve, reject) => {
        myAxios()
            .get('/alerts')
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
}