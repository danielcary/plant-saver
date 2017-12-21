import axios from 'axios';

export interface ISettings {
    email: string;
    notificationsEnabled: boolean;
    useFahrenheit: boolean;
    latitude: number;
    longitude: number;
    utcOffset: number;
};

let settings: ISettings = null;

export function login() {
    return new Promise<ISettings>((resolve, reject) => {
        axios.get('/user')
            .then(res => settings = res.data)
            .then(() => resolve(settings))
            .catch(err => reject(err))
    });
}

export function get() {
    return settings;
};

export function clear() {
    settings = null;
}

export function updateSettings(email: string, notificationsEnabled: boolean, useFahrenheit: boolean) {
    return new Promise<ISettings>((resolve, reject) => {
        axios.put('/user/settings', {
            email: email,
            notificationsEnabled: notificationsEnabled,
            useFahrenheit: useFahrenheit
        }).then(res => {
            // update locally 
            settings.email = email;
            settings.notificationsEnabled = notificationsEnabled;
            settings.useFahrenheit = useFahrenheit;

            resolve(settings);
        }).catch(err => reject(err));
    });
};

export function updateLocation(latitude: number, longitude: number, utcOffset: number) {
    return new Promise<ISettings>((resolve, reject) => {
        axios.put('/user/location', {
            latitude: latitude,
            longitude: longitude,
            utcOffset: utcOffset
        }).then(res => {
            // update locally
            settings.latitude = latitude;
            settings.longitude = longitude;
            settings.utcOffset = utcOffset;

            resolve(settings);
        }).catch(err => reject(err));
    });
}

export function deleteAccount() {
    return new Promise((resolve, reject) => {
        axios.delete('/user')
            .then(res => {
                settings = null;
                resolve();
            }).catch(err => reject(err));
    });
}