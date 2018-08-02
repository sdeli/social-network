function homeRoute(server ,db) {
    server.route('/', {method : 'GET'},(req, res) => {
        res.writeHead(200, 'OK', {contentType : 'text/plain'});

        var pageVars = {
            siteTitle : 'social network',
            pageTitle : 'Home',
            pageID : 'home_page'
        };

        res.renderFile('../views/landing.ejs', pageVars);
    });
}

module.exports = homeRoute;