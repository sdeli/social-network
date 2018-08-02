const fs = require('fs');
const path = require('path');

const {respondWithStaticFile} = require('./respond-with-static-file/respond-with-static-file.js');
const {urlParameterParser} = require('././ulr-parameter-parser/url-parameter-parser.js');
const getExtendedRes = require('./extend-response-obj/get-extended-response-object.js');

const publicFolder = '../public/';

let req;
let res;
let parsedUrl;

function routeHandler(request, respond, url) {
    req = request;
    res = respond;
    parsedUrl = url;

    let reqPath = parsedUrl.path;

    if (path.extname(reqPath)) {
        serveStaticFiles(reqPath);
    } else {
        servePages.call(this);
    }
}

function serveStaticFiles(reqPath) {
    let filePath = `${publicFolder}${reqPath}`;
    let ifFileExist = fs.existsSync(filePath);

    if (ifFileExist) {
        respondWithStaticFile(res, filePath);
    } else {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
    }
}

function servePages() {
    let queryStringObj = parsedUrl.query;
    let reqPath = parsedUrl.path;
    let routesArrLength = this.routesArr.length;

    for (let i = 0; i < routesArrLength; i++) {
        let route = this.routesArr[i];
        let pathVariables = urlParameterParser(reqPath, route.path);
        
        if (pathVariables) {
            let opts = route.opts || {method : 'GET'};
            let isMethodCorrect = req.method === opts.method;
            if (isMethodCorrect) {
                let extendedResponseObj = getExtendedRes(res, queryStringObj, pathVariables, this.ejsGlobals);
                route.callBack(req, extendedResponseObj);
            }
        }
    }
};

module.exports = routeHandler;