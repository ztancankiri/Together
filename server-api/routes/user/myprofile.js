const db = require('../../db-config');

module.exports = server => {
    server.get('/api/user/myprofile/', (req, res) => {
        const id = req.user.id;

        db.query('SELECT * FROM `Account` WHERE account_id = ?', [id])
            .then(async data => {
                const profileData = data[0];

                if (profileData.location !== null) {
                    const city_data = await db.query('SELECT name FROM `City` WHERE city_id = ?', [profileData.location]);
                    profileData.location = city_data[0].name;
                }

                console.log(profileData);
                res.send(profileData);
            })
            .catch(error => {
                console.log(error);
                res.send(401);
            });
    });
};
