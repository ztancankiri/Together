const db = require('../../db-config');

module.exports = server => {
    server.get('/api/group/request/list/:group_id/', async (req, res) => {
        const id = req.user.id;
        const group_id = req.params.group_id;

        const is_admin = await db.query('SELECT * FROM `member` WHERE group_id = ? AND account_id = ? AND status = 3', [group_id, id]);

        if (is_admin.length === 1) {
            db.query('SELECT * FROM `GroupJoinRequests` WHERE `group_id` = ?', [group_id])
                .then(data => {
                    console.log(data);
                    res.send(data);
                })
                .catch(error => {
                    console.log(error);
                    res.send(401);
                });
        } else {
            console.log('Member is not admin.');
            res.send(401);
        }
    });
};
