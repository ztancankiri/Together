const db = require('../../db-config');

module.exports = server => {
    server.get('/api/group/userin/member/:id/', (req, res) => {
        const id = req.params.id;
        db.query('SELECT * FROM `GroupCard` NATURAL JOIN `Member` WHERE status = 2 AND account_id = ?', [id])
            .then(data => {
                console.log(data);
                res.send(data);
            })
            .catch(error => {
                console.log(error);
                res.send(400, []);
            });
    });
};
