const db = require('../../db-config');

module.exports = server => {
    server.post('/api/messaging/pm/send/', async (req, res) => {
        const sender_id = req.user.id;
        const receiver_id = req.body.receiver;
        const message = req.body.message;

        try {
            const inserted = await db.query('INSERT INTO `message` (message_text, sender) VALUES (?, ?)', [message, sender_id]);
            await db.query('INSERT INTO `messagereceiveaccount` (message_id, account_id) VALUES (?, ?)', [inserted.insertId, receiver_id]);
            res.send({ status: 'success', message: 'Successful!' });
        } catch (error) {
            console.log(error);
            res.send(401);
        }
    });
};
