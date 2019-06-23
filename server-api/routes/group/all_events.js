const db = require('../../db-config');

module.exports = server => {
    server.get('/api/group/events/:group_id/', (req, res) => {
        const group_id = req.params.group_id;
        db.query('SELECT * FROM `EventCard` WHERE group_id = ?', [group_id])
            .then(data => {
                console.log(data);
                res.send(data);
            })
            .catch(error => {
                console.log(error);
                res.send(400, []);
            });
    });
};
