const db = require('../../db-config');

module.exports = server => {
    server.get('/api/event/attend/:id/', (req, res) => {
        let id = req.params.id;
        db.query('SELECT * FROM EventAttendList WHERE event_id = ?', [id])
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
