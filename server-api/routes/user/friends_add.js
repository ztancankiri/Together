const db = require('../../db-config');

module.exports = server => {
    server.post('/api/user/friends/add/', function respond(req, res) {
        const self_id = req.user.id;
        const friend_id = req.body.friend_id;

        const smaller = Math.min(self_id, friend_id);
        const bigger = Math.max(self_id, friend_id);

        db.query('INSERT INTO `Friends` (friend_id1, friend_id2, status, action_id) VALUES (?, ?, 0, ?)', [smaller, bigger, self_id])
            .then(() => {
                console.log('Friend added: ' + self_id + ', ' + friend_id + ', ' + 0);
                res.send({ success: 'success' });
            })
            .catch(error => {
                console.log(error);
                res.send(401);
            });
    });
};
