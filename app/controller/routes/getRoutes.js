function getRoutes(server ,db) {
    server.route('/', {method : 'GET'}, (req, res) => {
        res.writeHead(200, 'OK', {contentType : 'text/plain'});

        var pageVars = {
            siteTitle : 'social network',
            pageTitle : 'Home',
            pageID : 'home_page'
        };

        res.renderFile('../views/landing.ejs', pageVars);
    });

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

module.exports = getRoutes;