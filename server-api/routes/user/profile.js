const db = require('../../db-config');

module.exports = server => {
    server.get('/api/user/profile/:id/', (req, res) => {
        let id = req.params.id;
        db.query('SELECT first_name, last_name, image_path, bio_text, gender, birthday, location, member_since FROM `Account` WHERE account_id = ?', [id])
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
                res.send(400, {});
            });
    });
};
