// import dependencies from npm
const Fastify = require('fastify');
const path = require('path');
const AutoLoad = require('fastify-autoload');

const createServer = (options) => {
    // create the server
    const server = Fastify({
        ignoreTrailingSlash: true,
        logger: true
    });

    // start the server
    server.listen(9000, (err) => {
        if (err) {
            server.log.error(err);
            console.log(err);
            process.exit(1);
        }
        server.log.info('Server Started');
    });
}

module.exports = {
    createServer
}