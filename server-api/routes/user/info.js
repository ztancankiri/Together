const db = require('../../db-config');

module.exports = server => {
    server.get('/api/user/info/', (req, res) => {
        let user_id = req.user.id;
        db.query('SELECT first_name, last_name, image_path FROM `Account` WHERE account_id = ?', [user_id])
            .then(data => {
                console.log(data);
                res.send(data[0]);
            })
            .catch(error => {
                console.log(error);
                res.send(400, {});
            });
    });
};
