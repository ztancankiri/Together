const db = require('../../db-config');

module.exports = server => {
    server.post('/api/group/create/', async (req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const city = req.body.city;
        const categories = req.body.categories;
        const image_path = req.body.image;
        const user_id = req.user.id;

        try {
            const group_data = await db.query('INSERT INTO `Group` (name, group_in, description, created_by, image_path) VALUES (?, (SELECT city_id FROM `City` WHERE name = ?), ?, ?, ?)', [name, city, description, user_id, image_path]);

            let q = 'INSERT INTO `GroupCategory` (group_id, category_id) VALUES ';
            categories.forEach(element => {
                q += `(${group_data.insertId}, (SELECT category_id FROM Category WHERE name = '${element}')),`;
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
