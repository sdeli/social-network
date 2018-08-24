const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();
const {getUserInfosFromDb, aggregateUsersDb} = require('../../../model/user-db-fns.js');
const {getUserStatusesFromDb} = require('../../../model/user-status-db-fns.js');
const {redirectToOtherPage} = require('../../utils/utils.js');

function userProfilePageRoute(server ,db) {
    server.route('/user-profile-page', {method : 'GET'}, (req, res) => {
        let sessionCredentials = cookieAuthObj.checkIfLoggedIn(req, 'user_auth_session')
        let isUserLoggedIn = sessionCredentials && typeof sessionCredentials !== 'string';
        
        if (isUserLoggedIn) {
            sendProfilePage(res, db, sessionCredentials);
        } else {
            let signInPageUrl = `http://${req.headers.host}/`;
            redirectToOtherPage(res, signInPageUrl);
        }
    });
    
    function sendProfilePage(res, db, sessionCredentials) {
        let usersEmail = sessionCredentials.email;

        geFriendAndFrReqsFromUsersDb(usersEmail)        
        .then(usrProfileObj => {
            res.writeHead(200, 'OK', {contentType : 'text/html'});

            var pageVars = {
                siteTitle : 'social network',
                pageTitle : `${usrProfileObj.usrName}s Dashboard`,
                pageID : 'dashboard',
                userName : usrProfileObj.usrName,
                cssFileName : 'landing-bundled.css',
                usrProfileObj : usrProfileObj[0]
            };

            res.renderFile('../views/user-profile.ejs', pageVars);
        })
    }

    function geFriendAndFrReqsFromUsersDb(usersEmail) {
        let friendsLookupQuery = [
            {$match: {email : usersEmail}},
            {
                $lookup : {
                    from: "users",
                    localField: "friendRequests",
                    foreignField: "docId",
                    as: "friendRequests"
                }
            },
            {
                $lookup : {
                    from: "users",
                    localField: "friends",
                    foreignField: "docId",
                    as: "friends"
                }
            },
            
        ]

        return aggregateUsersDb(db, friendsLookupQuery);
    }
}

module.exports = userProfilePageRoute;