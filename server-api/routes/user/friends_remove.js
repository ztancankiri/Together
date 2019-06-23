const db = require('../../db-config');

module.exports = server => {
    server.post('/api/user/friends/remove/', function respond(req, res) {
        const self_id = req.user.id;
        const friend_id = req.body.friend_id;

        const smaller = Math.min(self_id, friend_id);
        const bigger = Math.max(self_id, friend_id);

        db.query('DELETE FROM `Friends` WHERE friend_id1 = ? AND friend_id2 = ?', [smaller, bigger])
            .then(() => {
                console.log('Friends removed: ' + smaller + ', ' + bigger);
                res.send({ success: 'success' });
            })
            .catch(error => {
                console.log(error);
                res.send(401);
            });
    });
};
