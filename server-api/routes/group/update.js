const db = require('../../db-config');

module.exports = server => {
    server.post('/api/group/update/', async (req, res) => {
        const user_id = req.user.id;
        const group_id = req.body.group_id;
        const name = req.body.name;
        const description = req.body.description;
        const city = req.body.city;
        const categories = req.body.categories;
        const image_path = req.body.image;

        try {
            await db.query('UPDATE `Group` SET name = ?, description = ?, group_in = (SELECT city_id FROM `City` WHERE name = ?) WHERE group_id = ?', [name, description, city, group_id]);

            if (image_path) {
                await db.query('UPDATE `Group` SET image_path = ? WHERE group_id = ?', [image_path, group_id]);
            }

            await db.query('DELETE FROM `GroupCategory` WHERE group_id = ?', [group_id]);

            let q = 'INSERT INTO `GroupCategory` (group_id, category_id) VALUES ';
            categories.forEach(element => {
                q += `(${group_id}, (SELECT category_id FROM Category WHERE name = '${element}')),`;
            });
            q = q.substr(0, q.length - 1);
            await db.query(q);

            res.send({ status: 'success', message: 'Successful!' });
        } catch (error) {
            console.log(error);
            res.send(401);
        }
    });
};
