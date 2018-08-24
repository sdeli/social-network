const fs = require('fs');

const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();
const {collectRequestBody, sendStatusMessageToFrontEnd, redirectToOtherPage} = require('../../utils/utils.js');
const {getUserInfosFromDb, updateUserInDb} = require('../../../model/user-db-fns.js');

function requestFriendshipRoute(server, db) {
    server.route('/request-friendship', {method : 'POST'}, (req, res) => {
        let sessionCredentials = cookieAuthObj.checkIfLoggedIn(req, 'user_auth_session')
        let isUserLoggedIn = sessionCredentials && typeof sessionCredentials !== 'string';
        
        if (isUserLoggedIn) {
            requestFriendship(req, res, db, sessionCredentials);
        } else {
            let signInPageUrl = `http://${req.headers.host}/`;
            redirectToOtherPage(res, signInPageUrl);
        }
    });

    function requestFriendship(req, res, db, sessionCredentials) {
        let requestingUsersEmail = sessionCredentials.email;
        let friendRequestedUsersDocId;

        collectRequestBody(req)
        .then(resultedDocId => {
            friendRequestedUsersDocId = resultedDocId;
            return getUserInfosFromDb(db, {email : requestingUsersEmail});
        })
        .then(requestingUsersDoc => {
            let findQuery = {docId : friendRequestedUsersDocId};
            let updateQuery = {$push: {friendRequests: requestingUsersDoc.docId}};

            return updateUserInDb(db, findQuery, updateQuery)
        })
        .then(ifUpdateSuccesful => {
            if (ifUpdateSuccesful) {
                let successMsg = 'friend requesting was succesful';
                sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', successMsg, res)
            } else {
                throw new Error('couldnt deploy friendship request');
            }
        })
        .catch(e => {
            sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', e.message, res);
        })
    }

    /*function getUpdateQueryForAgregation(friendRequestedUsersDocId, requestingUsersDocId) {
        let aggregationQuery = [
            {
                $match : { 
                    docId : friendRequestedUsersDocId
                }
            },
            {
                $lookup:
                    {
                         from: "users",
                         localField: "",
                         foreignField: "_id",
                         as: "textOfUser"
                    }
            }
        ]

        return aggregationQuery;
    }

    function insertUserToFriendRequestArrInDb() {
        return agregationInUsersDb();        
    }

    function agregationInUsersDb() {
        return new Promise((resolve, reject) => {
            db.collection('users')
            .aggregate(aggregationQuery)
            .toArray()
            .then((docs) => {
                console.log(JSON.stringify(docs, undefined, 2));
            }).catch(e => {
                console.log(e);
            })
        })
    }*/
}

module.exports = requestFriendshipRoute;