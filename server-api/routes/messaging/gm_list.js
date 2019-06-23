const db = require('../../db-config');

module.exports = server => {
    server.get('/api/messaging/gm/list/', async (req, res) => {
        const account_id = req.user.id;

        db.query('SELECT * FROM `gmlist` NATURAL JOIN `Member` WHERE account_id = ?', [account_id])
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
