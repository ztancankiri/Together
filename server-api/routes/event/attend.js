const db = require('../../db-config');

module.exports = server => {
    server.post('/api/event/attend/', (req, res) => {
        const account_id = req.user.id;
        const event_id = req.body.event_id;

        db.query('INSERT INTO `Attend` (account_id, event_id, status) VALUES (?, ?, 2)', [account_id, event_id])
            .then(() => {
                const msg = { status: 'success', message: `Account ${account_id} attended to event ${event_id}.` };
                console.log(msg);
                res.send(msg);
            })
            .catch(error => {
                console.log(error);
                res.send(401);
            });
    });
};
