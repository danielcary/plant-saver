
module.exports.makeEmail = function (email, plants) {
    let messageContent = 'It is going to be too cold for ';

    switch (plants.length) {
        case 1:
            messageContent += `${plants[0].name} tonight!`;
            break;
        case 2:
            messageContent += `${plants[0].name} and ${plants[1].name} tonight!`;
            break;
        case 3:
            messageContent += `${plants[0].name}`;
            for (let i = 1; i < plants.length - 1; i++) {
                messageContent += `, ${plants[i].name}`;
            }
            messageContent += `, and ${plants[plants.length - 1].name} tonight!`;
            break;
    }

    return {
        to: email,
        from: 'alert@plantsaver.danielcary.com',
        subject: "It's Going to be Cold Tonight",
        text: messageContent,
        html: messageContent
    };
}

module.exports.makeAlerts = function (id, plants) {
    return plants.map(plant => {
        return {
            id: id,
            message: `It is going to be too cold for ${plant.name} tonight!`
        }
    });
}

module.exports.getLow = async function (cache, lat, lng) {
    return new Promise((resolve, reject) => {

        if (cache[`${lat},${lng}`]) {
            resolve(cache[`${lat},${lng}`]);
        } else {
            axios.get(`https://api.darksky.net/forecast/${DARK_SKY_KEY}/${lat},${lng}`, {
                params: { exclude: 'currently,minutely,daily,alerts,flags' }
            }).then(res => {
                let low = res.data.hourly.data[0].temperature;

                for (let i = 1; i < 14; i++) {
                    if (low > res.data.hourly.data[i].temperature) {
                        low = res.data.hourly.data[i].temperature;
                    }
                }

                cache[`${lat},${lng}`] = low;
                resolve(low);
            }).catch(err => reject(err));
        }
    });
}