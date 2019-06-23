const db = require('../../db-config');

module.exports = server => {
    server.post('/api/event/comment/send/', async (req, res) => {
        const message = req.body.message;
        const replied_to = req.body.replied_to;
        const comment_at = req.body.comment_at;
        const commented_by = req.user.id;

        const is_attending = await db.query('SELECT * FROM `attend` WHERE account_id = ? AND event_id = ? AND status IN (2, 3)', [commented_by, comment_at]);

        if (is_attending.length === 1) {
            db.query('INSERT INTO `Comment` (message, replied_to, commented_by, comment_at) VALUES (?, ?, ?, ?)', [message, replied_to, commented_by, comment_at])
                .then(() => {
                    const msg = `Comment '${message}' is sent by account ${commented_by} as a reply to comment ${replied_to} at event ${comment_at}.`;
                    console.log(msg);
                    res.send({ success: msg });
                })
                .catch(error => {
                    console.log(error);
                    res.send(401);
                });
        } else {
            console.log('Member is not attending to event.');
            res.send(401);
        }
    });
};
