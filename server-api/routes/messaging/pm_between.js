const db = require('../../db-config');

module.exports = server => {
    server.get('/api/messaging/pm/pages/:sender/:start/:count/', (req, res) => {
        const receiver_id = req.user.id;
        const sender_id = req.params.sender;
        const start_id = parseInt(req.params.start);
        const count = parseInt(req.params.count);

        if (start_id === -1) {
            db.query('SELECT message_id, time, message_text FROM `pmcard` WHERE receiver_id IN (?, ?) AND sender_id IN (?, ?) ORDER BY message_id DESC LIMIT ?', [sender_id, receiver_id, sender_id, receiver_id, count])
                .then(data => {
                    const reversed = data.reverse();
                    console.log(reversed);
                    res.send(reversed);
                })
                .catch(error => {
                    console.log(error);
                    res.send(401);
                });
        } else {
            db.query('SELECT message_id, time, message_text FROM `pmcard` WHERE receiver_id IN (?, ?) AND sender_id IN (?, ?) AND message_id < ? ORDER BY message_id DESC LIMIT ?', [sender_id, receiver_id, sender_id, receiver_id, start_id, count])
                .then(data => {
                    const reversed = data.reverse();
                    console.log(reversed);
                    res.send(reversed);
                })
                .catch(error => {
                    console.log(error);
                    res.send(401);
                });
        }
    });
};
