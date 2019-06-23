const db = require('../../db-config');

module.exports = server => {
    server.get('/api/messaging/gm/pages/:group/:start/:end/', async (req, res) => {
        const account_id = req.user.id;
        const group_id = req.params.group;
        const start_id = req.params.start;
        const end_id = req.params.end;

        const is_member = await db.query('SELECT * FROM `member` WHERE group_id = ? AND account_id = ? AND status IN (2, 3)', [group_id, account_id]);

        if (is_member.length === 1) {
            db.query('SELECT message_id, time, message_text FROM `gmcard` WHERE group_id = ? AND (message_id BETWEEN ? AND ?)', [group_id, start_id, end_id])
                .then(data => {
                    console.log(data);
                    res.send(data);
                })
                .catch(error => {
                    console.log(error);
                    res.send(401);
                });
        } else {
            console.log('Not a member of the group.');
            res.send(401);
        }
    });
};
