const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();
const {getUserInfosFromDb} = require('../../../model/user-db-fns.js');
const {redirectToOtherPage, respondThisUserDoesntExistAnymore, sendStatusMessageToFrontEnd} = require('../../utils/utils.js');
// http://localhost:3000/diff-user-profile-page/asdasd5
function diffUsersProfilePageRoute(server ,db) {
    server.route('/diff-user-profile-page/:docid', {method : 'GET'}, (req, res) => {
        let sessionCredentials = cookieAuthObj.checkIfLoggedIn(req, 'user_auth_session')
        let isUserLoggedIn = sessionCredentials && typeof sessionCredentials !== 'string';
        
        if (isUserLoggedIn) {
            getDiffUsersProfilePage(db, req, res, sessionCredentials);
        } else {
            let dashboardPageUrl = `http://${req.headers.host}/dashboard`;
            redirectToOtherPage(res, dashboardPageUrl);
        }
    });

    function getDiffUsersProfilePage(db, req, res, sessionCredentials) {
        let usersEmail = sessionCredentials.email
        let diffUsersDocId = res.pathVariables.docid

        Promise.all([
            getUserInfosFromDb(db, {docId: diffUsersDocId}),   
            getUserInfosFromDb(db, {email: usersEmail})        
        ])
        .then(results => {
            let diffUsrProfileObj = results[0];
            let usrProfileObj = results[1];

            if (!diffUsrProfileObj) {
                throw new Error('this user doesn exist anymore')
            }

            let areTheySameUser = diffUsrProfileObj.docId === usrProfileObj.docId

            if (!areTheySameUser) {
                sendDiffUsersProfPage(res, diffUsrProfileObj, usrProfileObj);
            } else {
                redirectToUsersProfPage(req, res);
            }
        })
        .catch(e => {
                if (e.message === 'this user doesn exist anymore') {
                    respondThisUserDoesntExistAnymore(res);
                    //sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', e.message, res);
                } else {
                    sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', e.message, res);
                }
        })
    }

    function sendDiffUsersProfPage(res, diffUsrProfileObj, usrProfileObj) {
        let areTheyFriendsParams = [
            usrProfileObj.docId,
            diffUsrProfileObj.friendRequests,
            diffUsrProfileObj.friends
        ]

        let areTheyFriends = checkifFriends(...areTheyFriendsParams)

        var pageVars = {
            siteTitle : 'social network',
            pageTitle : `${diffUsrProfileObj.usrName}s Profile`,
            pageID : 'diff-users-profile',
            userName : diffUsrProfileObj.usrName,
            cssFileName : 'landing-bundled.css',
            areTheyFriends,
            diffUsrProfileObj
        };

        res.writeHead(200, 'OK', {contentType : 'text/html'});
        res.renderFile('../views/diff-users-profile.ejs', pageVars);
    }

    function redirectToUsersProfPage(req, res) {
        let userProfilePageUrl = `http://${req.headers.host}/user-profile-page`;
        redirectToOtherPage(res, userProfilePageUrl);
    }

    function checkifFriends(usrDocID, diffUsrsFriendRequests, diffUsrsFriends) {
        ifFriendRequest = diffUsrsFriendRequests.findIndex(friendRequest => friendRequest === usrDocID);

        if (ifFriendRequest > -1) {
            return 'friendship requested'
        }

        ifFriends = diffUsrsFriends.findIndex(friend => friend === usrDocID);

        if (ifFriends > -1) {
            return 'they are friends'
        } else {
            return 'no relation between them'
        }
    }
}
//http://localhost:3000/dashboard
module.exports = diffUsersProfilePageRoute;