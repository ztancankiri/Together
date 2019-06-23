const db = require('../../db-config');

module.exports = server => {
    server.get('/api/group/mymember/list/', (req, res) => {
        const account_id = req.user.id;
        db.query('SELECT * FROM `GroupCard` NATURAL JOIN `Member` WHERE status = 2 AND account_id = ?', [account_id])
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
