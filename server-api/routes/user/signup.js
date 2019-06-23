const db = require('../../db-config');
const validator = require('email-validator');

module.exports = server => {
    server.post('/api/user/signup/', async function respond(req, res) {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;

        if (validator.validate(email)) {
            const data = await db.query(
                `SELECT 
            CASE 
                WHEN email_count > 0 THEN -1
                WHEN email_count = 0 AND username_count > 0 THEN -2
                ELSE 1
            END AS result
            FROM (SELECT COUNT(*) AS email_count FROM account WHERE email = ?) AS t1, (SELECT COUNT(*) AS username_count FROM account WHERE username = ?) AS t2`,
                [email, username]
            );
            const result = data[0].result;

            if (result === 1) {
                db.query('INSERT INTO account (username, email, passwd, first_name, last_name) VALUES (?, ?, SHA2(?, 256), ?, ?)', [username, email, password, firstname, lastname])
                    .then(() => {
                        console.log(username + ' is inserted.');
                        res.send({ success: 'success' });
                    })
                    .catch(error => {
                        console.log(error);
                        res.send(401);
                    });
            } else if (result === -1) {
                console.log(email + ' exists.');
                res.send({ status: 'error', message: 'E-Mail exists.' });
            } else if (result === -2) {
                console.log(username + ' exists.');
                res.send({ status: 'error', message: 'Username exists.' });
            }
        } else {
            console.log(email + ' is not a valid e-mail address.');
            res.send({ status: 'error', message: 'E-Mail is not valid.' });
        }
    });
};
