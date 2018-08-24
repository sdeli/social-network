const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();
const {redirectToOtherPage} = require('../../utils/utils.js');

function signInPageRoute(server ,db) {
    server.route('/', {method : 'GET'}, (req, res) => {
        let sessionCredentials = cookieAuthObj.checkIfLoggedIn(req, 'user_auth_session')
        let isUserLoggedIn = sessionCredentials && typeof sessionCredentials !== 'string';
        
        if (!isUserLoggedIn) {
            sendSignUpPage(res);
        } else {
            let dashboardPageUrl = `http://${req.headers.host}/dashboard`;
            redirectToOtherPage(res, dashboardPageUrl);
        }
    });

    function sendSignUpPage(res) {
        res.writeHead(200, 'OK', {contentType : 'text/html'});

        var pageVars = {
            siteTitle : 'social network',
            pageTitle : 'Home',
            pageID : 'home_page',
            cssFileName : 'landing-bundled.css',
        };

        res.renderFile('../views/sign-in.ejs', pageVars);
    }
}
//http://localhost:3000/dashboard
module.exports = signInPageRoute;