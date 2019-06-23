const db = require('./db-config');

exports.authenticate = (username, password) => {
    return db.query('SELECT * FROM account WHERE username = ? AND passwd = SHA2(?, 256)', [username, password]);
};
