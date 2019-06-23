const db = require('../db-config');

module.exports = server => {
    server.get('/api/test/', async (req, res) => {
        const cdata = await db.query('SELECT name FROM `GroupCategory` NATURAL JOIN `Category` WHERE group_id = 31');

        const category_list = [];
        cdata.forEach(element => {
            category_list.push(element.name);
        });

        console.log(category_list);

        res.send({ status: 'success', message: 'Successful!' });
    });
};
