const db = require('../../db-config');

module.exports = server => {
    server.get('/api/messaging/gm/all/:group_id/', async (req, res) => {
        const account_id = req.user.id;
        const group_id = req.params.group_id;

        const is_member = await db.query('SELECT * FROM `member` WHERE group_id = ? AND account_id = ? AND status IN (2, 3)', [group_id, account_id]);

        if (is_member.length === 1) {
            db.query('SELECT message_id, time, message_text, sender_id, sender_name, sender_image FROM `gmcard` WHERE group_id = ?', [group_id])
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
