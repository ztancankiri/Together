const db = require('../../db-config');

module.exports = server => {
    server.post('/api/group/member/remove/', async (req, res) => {
        const account_id = req.user.id;
        const group_id = req.body.group_id;
        const member_id = req.body.member_id;

        const is_admin = await db.query('SELECT * FROM `member` WHERE group_id = ? AND account_id = ? AND status = 3', [group_id, account_id]);

        if (is_admin.length === 1) {
            db.query('UPDATE `Member` SET status = -1 WHERE group_id = ? AND account_id = ?', [group_id, member_id])
                .then(() => {
                    const msg = `User ${member_id} is removed from group ${group_id}.`;
                    console.log(msg);
                    res.send({ success: msg });
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
