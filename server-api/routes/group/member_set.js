const db = require('../../db-config');

module.exports = server => {
    server.post('/api/group/member/set/', async (req, res) => {
        const account_id = req.user.id;
        const group_id = req.body.group_id;
        const member_id = req.body.member_id;
        const status = req.body.status;
        const title = req.body.title;

        const is_admin = await db.query('SELECT * FROM `member` WHERE group_id = ? AND account_id = ? AND status = 3', [group_id, account_id]);

        if (is_admin.length === 1) {
            db.query('UPDATE `Member` SET status = ?, title = ? WHERE group_id = ? AND account_id = ?', [status, title, group_id, member_id])
                .then(() => {
                    const msg = `User ${member_id}'s status is set to ${status} in group ${group_id}.`;
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
