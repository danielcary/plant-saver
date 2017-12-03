import axios from 'axios';

export interface ISettings {
    locationId: number;
    locationAddress: string;
    email: string;
    phone: string;
    notificationsEnabled: boolean;
    // useEmailNotifications: boolean;
    // useFahrenheit: boolean;
};

let settings: ISettings = {
    email: null,
    locationAddress: null,
    locationId: null,
    notificationsEnabled: null,
    phone: null
};

export function login() {
    return new Promise<ISettings>((resolve, reject) => {
        axios.get('/user').then(res => {
            if (!res.data.success) {
                reject(res);
            }
            
            settings = res.data;

            resolve(settings);
        }).catch(err => {
            reject(err);
        })
    });
}

export function get() {
    return settings;
};

export function save(location: string, email: string, phoneNumber: string, useEmailNt: boolean, useFahrenheit: boolean) {
    return new Promise<ISettings>((resolve, reject) => {

    /*    settings.location = location;
        settings.email = email;
        settings.phoneNumber = phoneNumber;
        settings.useEmailNotifications = useEmailNt;
        settings.useFahrenheit = useFahrenheit;
*/
        resolve(settings);
    });
};

export function toggleNotifications() {
    return new Promise<ISettings>((resolve, reject) => {

      //  settings.areNotificationsPaused = !settings.areNotificationsPaused;

        resolve(settings);
    });
};


