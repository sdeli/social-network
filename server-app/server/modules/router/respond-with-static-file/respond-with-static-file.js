const fs = require('fs');
const path = require('path');

function respondWithStaticFile(res, filePath, options) {
    options = options || {};
    let statusCode = options.statusCode || 200;
    let contentType = options.contentType || getContentType(filePath);

    res.writeHead(statusCode, {'Content-Type' : contentType});
    sendStaticFile(res, filePath);
}

function getContentType(filePath) {
    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream';

    return contentType;
}

function sendStaticFile(res, filePath) {
    let reader = fs.createReadStream(filePath);

    reader.on('geza', () => {
        res.writeHead(404, {'Content-Type' : 'text/html'});
        res.end('<h1>404\nThere Has been an issue with the file pleasse check with your site admin</h1>');
    });

    reader.pipe(res);
    res.on('finsh', () => {
        res.end();
    });
}

module.exports = {
    respondWithStaticFile,
    getContentType,
    sendStaticFile
}