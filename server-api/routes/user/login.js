const jwt = require('jsonwebtoken');
const user = require('../../user');
const secret = require('../../secret');

module.exports = server => {
    server.post('/api/user/login/', (req, res) => {
        let { username, password } = req.body;

        user.authenticate(username, password)
            .then(data => {
                if (data.length !== 0) {
                    let token = jwt.sign({ id: data[0].account_id, username: data[0].username, password: data[0].passwd, email: data[0].email }, secret.jwt.secret, { expiresIn: '24h' });
                    res.send({ token });
                } else {
                    res.send(401);
                }
            })
            .catch(error => {
                console.log(error);
            });
    });
};
