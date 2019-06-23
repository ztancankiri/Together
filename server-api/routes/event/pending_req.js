const db = require('../../db-config');

module.exports = server => {
    server.get('/api/event/pending/:eventid/', (req, res) => {
        let event_id = req.params.eventid;
        db.query('SELECT * FROM EventPendingRequests WHERE event_id = ?', [event_id])
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
