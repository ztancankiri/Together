const db = require('../../db-config');

module.exports = server => {
    server.get('/api/group/category/all/', (req, res) => {
        let id = req.params.id;
        db.query('SELECT name FROM `Category`')
            .then(data => {
                console.log(data);
                res.send(data);
            })
            .catch(error => {
                console.log(error);
                res.send(400);
            });
    });
};
