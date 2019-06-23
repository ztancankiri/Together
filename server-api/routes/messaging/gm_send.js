const db = require('../../db-config');

module.exports = server => {
    server.post('/api/messaging/gm/send/', async (req, res) => {
        const sender_id = req.user.id;
        const group_id = req.body.group_id;
        const message = req.body.message;

        try {
            const inserted = await db.query('INSERT INTO `message` (message_text, sender) VALUES (?, ?)', [message, sender_id]);
            await db.query('INSERT INTO `messagereceivegroup` (message_id, group_id) VALUES (?, ?)', [inserted.insertId, group_id]);
            res.send({ status: 'success', message: 'Successful!' });
        } catch (error) {
            console.log(error);
            res.send(401);
        }
    });
};
