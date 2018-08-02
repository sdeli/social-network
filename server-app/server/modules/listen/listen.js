const http = require('http');

function listen(port) {
    return http.createServer((req, res) => {
        this.routeHandler.router(req, res);
    }).listen(port);
}

module.exports = listen;