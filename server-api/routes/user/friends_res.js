const db = require('../../db-config');

module.exports = server => {
    server.post('/api/user/friends/response/', function respond(req, res) {
        const self_id = req.user.id;
        const status = req.body.status;
        const friend_id = req.body.friend_id;

        const smaller = Math.min(self_id, friend_id);
        const bigger = Math.max(self_id, friend_id);

        if (status === 1 || status === 0) {
            db.query('UPDATE `Friends` SET status = ?, action_id = ? WHERE friend_id1 = ? AND friend_id2 = ?', [status, self_id, smaller, bigger])
                .then(() => {
                    console.log('Friend response: ' + smaller + ', ' + bigger + ', ' + status);
                    res.send({ success: 'success' });
                })
                .catch(error => {
                    console.log(error);
                    res.send(401);
                });
        } else {
            console.log('Wrong status id!');
            res.send(401);
        }
    });
};
