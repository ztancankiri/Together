const db = require('../../db-config');

module.exports = server => {
    server.get('/api/group/info/:id/', async (req, res) => {
        const group_id = req.params.id;

        try {
            const group = await db.query('SELECT * FROM `GroupInfo` WHERE group_id = ?', [group_id]);
            group[0].members = await db.query('SELECT account_id, image_path FROM `Member` NATURAL JOIN `Account` WHERE group_id = ? AND status IN (2, 3) LIMIT 3', [group_id]);
            group[0].admins = await db.query("SELECT account_id, CONCAT(first_name, ' ', last_name) AS name, image_path FROM `Member` NATURAL JOIN `Account` WHERE group_id = ? AND status = 3", [group_id]);
            group[0].categories = await db.query('SELECT `name` FROM `Category` AS C, `GroupCategory` AS GC WHERE C.category_id = GC.category_id AND group_id = ?', [group_id]);
            res.send(group[0]);
        } catch (error) {
            console.log(error);
            res.send(401);
        }
    });
};
