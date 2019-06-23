const db = require('../../db-config');

module.exports = server => {
    server.get('/api/messaging/pm/all/:sender/', (req, res) => {
        const receiver_id = req.user.id;
        const sender_id = req.params.sender;

        db.query('SELECT message_id, time, message_text, sender_id, receiver_id FROM `pmcard` WHERE receiver_id IN (?, ?) AND sender_id IN (?, ?)', [sender_id, receiver_id, sender_id, receiver_id])
            .then(data => {
                console.log(data);
                res.send(data);
            })
            .catch(error => {
                console.log(error);
                res.send(401);
            });
    });
};
