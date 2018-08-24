const fs = require('fs');

const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();
const {collectRequestBody, sendStatusMessageToFrontEnd, redirectToOtherPage} = require('../../utils/utils.js');
const {getUserInfosFromDb, updateUserInDb} = require('../../../model/user-db-fns.js');

function whitdrawFriendshipRequestRoute(server, db) {
    server.route('/whitdraw-friendship-request', {method : 'POST'}, (req, res) => {
        let sessionCredentials = cookieAuthObj.checkIfLoggedIn(req, 'user_auth_session')
        let isUserLoggedIn = sessionCredentials && typeof sessionCredentials !== 'string';
        
        if (isUserLoggedIn) {
            whitdrawFriendshipRequest(req, res, db, sessionCredentials);
        } else {
            let signInPageUrl = `http://${req.headers.host}/`;
            redirectToOtherPage(res, signInPageUrl);
        }
    });

    function whitdrawFriendshipRequest(req, res, db, sessionCredentials) {
        let requestingUsersEmail = sessionCredentials.email;
        let friendRequestedUsersDocId;

        collectRequestBody(req)
        .then(resultedDocId => {
            friendRequestedUsersDocId = resultedDocId;
            return getUserInfosFromDb(db, {email : requestingUsersEmail});
        })
        .then(requestingUsersDoc => {
            let findQuery = {docId : friendRequestedUsersDocId};
            let updateQuery = {$pull: {friendRequests: requestingUsersDoc.docId}};

            return updateUserInDb(db, findQuery, updateQuery)
        })
        .then(ifUpdateSuccesful => {
            if (ifUpdateSuccesful) {
                let successMsg = 'FriendshipReqs whitdrawal was succesful';
                sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', successMsg, res);
            } else {
                throw new Error('couldnt whitdraw friendship request');
            }
        })
        .catch(e => {
            sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', e.message, res);
        })
    }
}

module.exports = whitdrawFriendshipRequestRoute;