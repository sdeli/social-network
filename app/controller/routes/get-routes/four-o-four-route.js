function fourOFourRoute(server, db) {
    server.route('/*', (req, res) => {
        res.writeHead(200, 'OK', {contentType : 'text/plain'});

        var pageVars = {
            siteTitle : 'social network',
            pageTitle : '404',
            pageID : '404'
        };

        res.renderFile('../views/404.ejs', pageVars);
    });
}

module.exports = fourOFourRoute;