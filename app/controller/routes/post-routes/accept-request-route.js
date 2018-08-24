const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();
const {updateUserInDb, getUserInfosFromDb} = require('../../../model/user-db-fns.js');
const {redirectToOtherPage, collectRequestBody, sendStatusMessageToFrontEnd} = require('../../utils/utils.js');
// http://localhost:3000/diff-user-profile-page/asdasd5
function acceptFriendRequestRoute(server ,db) {
    server.route('/accept-request', {method : 'POST'}, (req, res) => {
        let sessionCredentials = cookieAuthObj.checkIfLoggedIn(req, 'user_auth_session')
        let isUserLoggedIn = sessionCredentials && typeof sessionCredentials !== 'string';
        
        if (isUserLoggedIn) {
            acceptFriendRequest(db, req, res, sessionCredentials);
        } else {
            let dashboardPageUrl = `http://${req.headers.host}/dashboard`;
            redirectToOtherPage(res, dashboardPageUrl);
        }
    });

    function acceptFriendRequest(db, req, res, sessionCredentials) {
        let usersEmail = sessionCredentials.email

        collectRequestBody(req)
        .then(friendsDocId => {
            return Promise.all([
                addUserToFriendsFriends(db, usersEmail, friendsDocId),
                addfriendToUsersFriends(db, usersEmail, friendsDocId),
                removeFriendFromFriendshipRequesters(db, usersEmail, friendsDocId)
            ])
        })
        .then(results => {
            let wasUpdateSuccesful = results[0] && results[1] && results[2];

            if (wasUpdateSuccesful) {
                let succesMsg = 'changes made in db succesfully';
                sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', succesMsg, res)
            } else {
                throw new Error('updates in db have been unsuccesful')
            }
        })
        .catch(e => {
            sendStatusMessageToFrontEnd(200, "OK", 'text/plain', e.message, res)
        })
    }

    function addUserToFriendsFriends(db, usersEmail, friendsDocId) {
        return getUserInfosFromDb(db, {email : usersEmail})
        .then(userInfos => {
            let findFriendQuery = {docId : friendsDocId}
            let addUserToFriendQuery = {$push : {friends : userInfos.docId}};
            return updateUserInDb(db, findFriendQuery, addUserToFriendQuery);
        })
    }

    function addfriendToUsersFriends(db, usersEmail, friendsDocId) {
        let findUserQuery = {email : usersEmail};
        let addFriendQuery = {$push : {friends : friendsDocId}};

        return updateUserInDb(db, findUserQuery, addFriendQuery);
    }

    function removeFriendFromFriendshipRequesters(db, usersEmail, friendsDocId) {
        let findUserQuery = { email : usersEmail };
        let removeFriendRequesterQuery = { $pull: { friendRequests: { $in: [ friendsDocId ] } } };

        return updateUserInDb(db, findUserQuery, removeFriendRequesterQuery);
    }
}
//http://localhost:3000/dashboard
module.exports = acceptFriendRequestRoute;