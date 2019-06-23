const db = require('../../db-config');

module.exports = server => {
    server.get('/api/user/friends/requests/', (req, res) => {
        const id = req.user.id;

        db.query('SELECT * FROM `FriendRequests` WHERE (`friend_id1` = ? OR `friend_id2` = ?) AND `status` = 0 AND `action_id` != ?', [id, id, id])
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
