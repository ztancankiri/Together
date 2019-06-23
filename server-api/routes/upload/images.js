const plugins = require('restify').plugins;

module.exports = server => {
    server.get('/api/images/*', plugins.serveStaticFiles('./uploads'));
};
