const db = require('../../db-config');

module.exports = server => {
    server.get('/api/user/friends/', (req, res) => {
        const id = req.user.id;

        db.query('SELECT * FROM `FriendList` WHERE (`friend_id1` = ? OR `friend_id2` = ?)', [id, id])
            .then(data => {
                const result = [];
                data.forEach(element => {
                    if (element.friend_id1 === id) {
                        result.push({ friend_id: element.friend_id2, friend_name: element.friend_name2, friend_image: element.friend_image2 });
                    } else if (element.friend_id2 === id) {
                        result.push({ friend_id: element.friend_id1, friend_name: element.friend_name1, friend_image: element.friend_image1 });
                    }
                });

                console.log(result);
                res.send(result);
            })
            .catch(error => {
                console.log(error);
                res.send(401);
            });
    });
};
