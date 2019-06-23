const mv = require('mv');

module.exports = server => {
    server.post('/api/upload/', (req, res) => {
        const myImage = req.files.imgFile;
        const new_name = `${new Date().getTime()}.jpg`;
        const new_path = `uploads/${new_name}`;

        mv(myImage.path, new_path, { mkdirp: true }, err => {
            if (err) {
                console.log(err);
                res.send(401);
            } else {
                res.send({ img: new_name });
            }
        });
    });
};
