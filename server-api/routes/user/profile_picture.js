const db = require('../../db-config');

module.exports = server => {
    server.post('/api/user/profile_picture/', (req, res) => {
        let id = req.user.id;

        db.query('UPDATE `Account` SET `image_path` = ? WHERE account_id = ?', [req.body.image_path, id])
            .then(data => {
                res.send(200);
            })
            .catch(error => {
                console.log(error);
                res.send(401);
            });
    });
}