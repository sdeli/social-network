const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();
const {getUserInfosFromDb} = require('../../../model/user-db-fns.js');
const {getUserStatusesFromDb} = require('../../../model/user-status-db-fns.js');
const {redirectToOtherPage} = require('../../utils/utils.js');

function userDashboardRoute(server ,db) {
    server.route('/dashboard', {method : 'GET'}, (req, res) => {
        let sessionCredentials = cookieAuthObj.checkIfLoggedIn(req, 'user_auth_session')
        let isUserLoggedIn = sessionCredentials && typeof sessionCredentials !== 'string';
        
        if (isUserLoggedIn) {
            sendDashboardPage(res, db, sessionCredentials);
        } else {
            let signInPageUrl = `http://${req.headers.host}/`;
            redirectToOtherPage(res, signInPageUrl);
        }
    });
    
    function sendDashboardPage(res, db, sessionCredentials) {
        let usersEmail = sessionCredentials.email;

        Promise.all([ 
            getUserStatusesFromDb(db, {}),
            getUserInfosFromDb(db, {email: usersEmail})    
        ])
        .then(resultsArr => {
            res.writeHead(200, 'OK', {contentType : 'text/html'});

            var pageVars = {
                siteTitle : 'social network',
                pageTitle : `${resultsArr[1].usrName}s Dashboard`,
                pageID : 'dashboard',
                userName : resultsArr[1].usrName,
                cssFileName : 'landing-bundled.css',
                userStatusesArr : resultsArr[0]
            };

            res.renderFile('../views/dashboard.ejs', pageVars);
        })
    }
}

module.exports = userDashboardRoute;