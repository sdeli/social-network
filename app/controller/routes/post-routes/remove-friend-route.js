const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();
const {updateUserInDb, getUserInfosFromDb} = require('../../../model/user-db-fns.js');
const {redirectToOtherPage, collectRequestBody, sendStatusMessageToFrontEnd} = require('../../utils/utils.js');
// http://localhost:3000/diff-user-profile-page/asdasd5
function removeFriendFromFriendsRoute(server ,db) {
    server.route('/remove-friend', {method : 'POST'}, (req, res) => {
        let sessionCredentials = cookieAuthObj.checkIfLoggedIn(req, 'user_auth_session')
        let isUserLoggedIn = sessionCredentials && typeof sessionCredentials !== 'string';
        
        if (isUserLoggedIn) {
            removeFriendFromFriends(db, req, res, sessionCredentials);
        } else {
            let dashboardPageUrl = `http://${req.headers.host}/dashboard`;
            redirectToOtherPage(res, dashboardPageUrl);
        }
    });

    function removeFriendFromFriends(db, req, res, sessionCredentials) {
        let usersEmail = sessionCredentials.email

        collectRequestBody(req)
        .then(friendsDocId => {
            return Promise.all([
                removeFriendFromUsersFriends(db, usersEmail, friendsDocId),
                removeUserFromFrinedsFriends(db, usersEmail, friendsDocId)
            ])
        })
        .then(wasUpdateSuccesful => {
            if (wasUpdateSuccesful) {
                let succesMsg = 'friend removal was succesful';
                sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', succesMsg, res)
            } else {
                throw new Error('updates in db have been unsuccesful')
            }
        })
        .catch(e => {
            sendStatusMessageToFrontEnd(200, "OK", 'text/plain', e.message, res)
        })
    }

    function removeFriendFromUsersFriends(db, usersEmail, friendsDocId) {
        let fiendUserQuery = { email : usersEmail };
        let removeFriendQuery = { $pull: { friends: { $in: [ friendsDocId ] } } };

        return updateUserInDb(db, fiendUserQuery, removeFriendQuery);
    }

    function removeUserFromFrinedsFriends(db, usersEmail, friendsDocId) {
        return getUserInfosFromDb(db, {email : usersEmail})
        .then(userInfos => {
            let findFriendQuery = {docId : friendsDocId}
            let removeUserFromFriendsQuery = {$pull : {friends : userInfos.docId}};

            return updateUserInDb(db, findFriendQuery, removeUserFromFriendsQuery);
        })
    }
}
//http://localhost:3000/dashboard
module.exports = removeFriendFromFriendsRoute;