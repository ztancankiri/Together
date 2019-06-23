const db = require('../../db-config');

module.exports = server => {
    server.get('/api/group/search/:text/', (req, res) => {
        let text = `%${req.params.text}%`;
        db.query('SELECT * FROM `GroupCard` group_name LIKE ?', [text])
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
