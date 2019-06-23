const db = require('../../db-config');

module.exports = server => {
    server.get('/api/city/all/', (req, res) => {
        db.query('SELECT name FROM `City`')
            .then(data => {
                console.log(data);
                res.send(data);
            })
            .catch(error => {
                console.log(error);
                res.send([]);
            });
    });
};
