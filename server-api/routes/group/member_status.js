const db = require('../../db-config');

module.exports = server => {
    server.get('/api/group/member/status/:group_id/', (req, res) => {
        const id = req.user.id;
        const group_id = req.params.group_id;

        db.query('SELECT * FROM `Member` WHERE `group_id` = ? AND `account_id` = ?', [group_id, id])
            .then(data => {
                if (data.length === 0) {
                    const result = { status: -1 };
                    console.log(result);
                    res.send(result);
                } else {
                    const result = { status: data[0].status };
                    console.log(result);
                    res.send(result);
                }
            })
            .catch(error => {
                console.log(error);
                res.send(401);
            });
    });
};
