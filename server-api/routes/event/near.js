const db = require('../../db-config');
const moment = require('moment');

module.exports = server => {
    server.get('/api/event/near/:start_time/:end_time/:city/', (req, res) => {
        const start_time = req.params.start_time;
        const end_time = req.params.end_time;
        const city = `%${req.params.city}%`;

        db.query('SELECT * FROM `EventCard` WHERE ((start_time BETWEEN ? AND ?) OR (end_time BETWEEN ? AND ?)) AND city LIKE ?', [start_time, end_time, start_time, end_time, city])
            .then(data => {
                data.forEach(element => {
                    const time = element.time;
                    element.date = moment(time).format('DD/MM/YYYY');
                    element.time = moment(time).format('HH:mm');
                });
                console.log(data);
                res.send(data);
            })
            .catch(error => {
                console.log(error);
                res.send(400, []);
            });
    });
};
