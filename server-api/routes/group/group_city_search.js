const db = require('../../db-config');

module.exports = server => {
    server.get('/api/group/search/city/:text/', (req, res) => {
        const text = `%${req.params.text}%`;

        db.query('SELECT * FROM `GroupCard` WHERE city_name LIKE ?', [text])
            .then(data => {
                console.log(data);
                res.send(data);
            })
            .catch(error => {
                console.log(error);
                res.send(401);
            });
    });
};
