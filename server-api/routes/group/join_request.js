const db = require('../../db-config');

module.exports = server => {
    server.post('/api/group/request/join/', async (req, res) => {
        const account_id = req.user.id;
        const group_id = req.body.group_id;

        db.query('INSERT INTO `Member` (group_id, account_id, status) VALUES (?, ?, 1)', [group_id, account_id])
            .then(data => {
                const msg = 'requested.';
                console.log(msg);
                res.send({ success: msg });
            })
            .catch(error => {
                console.log(error);
                res.send(401);
            });
    });
};
