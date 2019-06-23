const db = require('../../db-config');

module.exports = server => {
    server.get('/api/messaging/pm/list/', (req, res) => {
        const receiver_id = req.user.id;

        db.query("SELECT conversation, A.account_id, CONCAT(A.first_name, ' ', A.last_name) AS `name`, A.image_path FROM (SELECT DISTINCT (CASE WHEN sender_id = ? THEN receiver_id  WHEN receiver_id = ? THEN sender_id END) AS conversation FROM `pmcard`) AS PC JOIN `account` AS A ON conversation = account_id", [receiver_id, receiver_id])
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
