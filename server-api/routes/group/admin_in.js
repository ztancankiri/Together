const db = require('../../db-config');

module.exports = server => {
    server.get('/api/group/userin/admin/:id/', (req, res) => {
        let self_id = req.params.id;

        if (self_id === 'self') {
            self_id = req.user.id;
        }

        db.query('SELECT * FROM `GroupCard` NATURAL JOIN `Member` WHERE status = 3 AND account_id = ?', [self_id])
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
