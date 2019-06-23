const db = require('../../db-config');

module.exports = server => {
    server.post('/api/event/comment/remove/', async (req, res) => {
        const account_id = req.user.id;
        const comment_id = req.body.comment_id;

        const owner = await db.query('SELECT * FROM `Comment` WHERE comment_id = ? AND commented_by = ?', [comment_id, account_id]);
        const is_admin = await db.query('SELECT * FROM `attend` WHERE event_id = (SELECT comment_at FROM `comment` WHERE comment_id = ?) AND account_id = ? AND status = 3', [comment_id, account_id]);

        if (owner.length === 1 || is_admin.length === 1) {
            db.query('DELETE FROM `Comment` WHERE comment_id = ?', [comment_id])
                .then(() => {
                    const msg = `Comment '${message}' is deleted.`;
                    console.log(msg);
                    res.send({ success: msg });
                })
                .catch(error1 => {
                    console.log(error);
                    res.send(401);
                });
        } else {
            console.log('Do not have auth to remove comment.');
            res.send(401);
        }
    });
};
