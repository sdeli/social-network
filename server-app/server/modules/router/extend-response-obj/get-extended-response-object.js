const ejs = require('ejs');
const http = require('http');

function getExtendedRes(res, queryStrings, pathVariables, ejsGlobals) {
    let extendedRes = {
        res,
        writeHead : function() {
            this.res.writeHead(...arguments);   
        },
        write : function(data) {
            this.res.write(data)
        },
        end : function(data) {
            this.res.end(data)
        },
        renderFile : function (templatePath, opts) {
            var opts = opts || {};

            let extendedOpts = {
                ...ejsGlobals,
                ...opts
            }
            
            let error = '';
            ejs.renderFile(templatePath, extendedOpts, (err, html) => {
                if (err) {
                    console.log(err);   
                    error = err;
                } else {
                    res.write(html);
                    res.end();
                }
            });

            if (error !== '') console.log(error);
        },
        on : function(event, callback){
            this.res.on(event, callback);
        },
        queryStrings,
        pathVariables
    };

    return extendedRes;
}

module.exports = getExtendedRes;