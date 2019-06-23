const db = require('../../db-config');

module.exports = server => {
    server.get('/api/city/search/:text/', (req, res) => {
        if (req.params.text.length > 0) {
            const text = `%${req.params.text}%`;
            db.query('SELECT name FROM `City` WHERE name LIKE ?', [text])
                .then(data => {
                    console.log(data);
                    res.send(data);
                })
                .catch(error => {
                    console.log(error);
                    res.send([]);
                });
        } else {
            res.send([]);
        }
    });
};
