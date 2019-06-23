const db = require('../../db-config');

module.exports = server => {
    server.get('/api/user/friends/check/:friend_id/', (req, res) => {
        const id = req.user.id;
        const friend_id = req.params.friend_id;

        const smaller = Math.min(id, friend_id);
        const bigger = Math.max(id, friend_id);

        db.query('SELECT * FROM `FriendList` WHERE `friend_id1` = ? AND `friend_id2` = ?', [smaller, bigger])
            .then(data => {
                if (data.length === 0) {
                    const result = { friend_status: 'nofriend' };
                    console.log(result);
                    res.send(result);
                } else {
                    if (data[0].status === 0) {
                        const result = { friend_status: 'pending' };
                        console.log(result);
                        res.send(result);
                    } else if (data[0].status === 1) {
                        const result = { friend_status: 'friend' };
                        console.log(result);
                        res.send(result);
                    }
                }
            })
            .catch(error => {
                console.log(error);
                res.send(401);
            });
    });
};
