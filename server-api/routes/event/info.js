const db = require('../../db-config');

module.exports = server => {
    server.get('/api/event/info/:id/', async (req, res) => {
        const event_id = parseInt(req.params.id);

        try {
            const event = await db.query('SELECT * FROM `EventInfo` WHERE event_id = ?', [event_id]);
            event[0].attendees = await db.query('SELECT account_id, image_path FROM `Attend` NATURAL JOIN `Account` WHERE event_id = ? AND status IN (2, 3) LIMIT 3', [event_id]);
            event[0].organizers = await db.query("SELECT account_id, CONCAT(first_name, ' ', last_name) AS name, image_path FROM `Attend` NATURAL JOIN `Account` WHERE event_id = ? AND status = 3", [event_id]);
            res.send(event[0]);
        } catch (error) {
            console.log(error);
            res.send(401);
        }
    });
};
