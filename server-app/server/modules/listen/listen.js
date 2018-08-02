const http = require('http');
const url = require('url');

const {trimmPath} = require('../../server-utils/utils.js');

function listen(port) {
    return http.createServer((req, res) => {
        let parsedUrl = url.parse(req.url, true)
        parsedUrl.path = trimmPath(parsedUrl.path);

        this.routeHandler.router(req, res, parsedUrl);
    }).listen(port);
}

module.exports = listen;