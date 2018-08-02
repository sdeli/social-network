const fs = require('fs');
const path = require('path');
const url = require('url');
const {trimmPath} = require('../../server-utils/utils.js');

const respondWithStaticFile = require('./respond-with-static-file/respond-with-static-file.js');
const urlParameterParser = require('././ulr-parameter-parser/url-parameter-parser.js');
const {sendTemplateByEjs} = require('../../server-utils/utils.js');
const getExtendedRes = require('./extend-response-obj/get-extended-response-object.js');

const publicFolder = '../public/';

let req; 
let res; 
let parsedUrl;

function routeHandler(request, response) {
    req = request; 
    res = response; 
    parsedUrl = url.parse(req.url, true)
    parsedUrl.path = trimmPath(parsedUrl.path);

    if (path.extname(parsedUrl.path)) {
        serveStaticFiles();
    } else {
        servePages.call(this, req, res, parsedUrl);
    }
}

function serveStaticFiles() {
    let filePath = `${publicFolder}${parsedUrl.path}`;
    let ifFileExist = fs.existsSync(filePath);

    if (ifFileExist) {
        respondWithStaticFile(res, filePath);
    } else {
        send404byPlainText();
    }
}

function servePages() {
    let queryStringObj = parsedUrl.query;
    let routesArrLength = this.routesArr.length;

    for (let i = 0; i < routesArrLength; i++) {
        let route = this.routesArr[i];
        let pathVariables = urlParameterParser(parsedUrl.path, route.path);
        
        if (pathVariables) {
            let opts = route.opts || {method : 'GET'};
            let isMethodCorrect = req.method === opts.method;
            if (isMethodCorrect) {
                let extendedResponseObj = getExtendedRes(res, queryStringObj, pathVariables, this.ejsGlobals);
                route.callBack(req, extendedResponseObj);
            }
            
            break;
        } else if (pathVariables === false && i === routesArrLength - 1) {
            send404byPlainText();
        }
    }
};

function send404byPlainText() {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("404 Not Found\n");
    res.end();
}

module.exports = routeHandler;