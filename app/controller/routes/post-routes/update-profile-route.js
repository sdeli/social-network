const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();
const {getUserInfosFromDb, updateUserInDb} = require('../../../model/user-db-fns.js');
const {getUserStatusesFromDb} = require('../../../model/user-status-db-fns.js');
const {redirectToOtherPage, sendObjToFrontEnd, collectRequestBody} = require('../../utils/utils.js');

//http://localhost:3000/user-profile-page
function updateProfileRoute(server ,db) {
    server.route('/update-user-profile', {method : 'POST'}, (req, res) => {
        let sessionCredentials = cookieAuthObj.checkIfLoggedIn(req, 'user_auth_session')
        let isUserLoggedIn = sessionCredentials && typeof sessionCredentials !== 'string';
        
        if (isUserLoggedIn) {
            updateProfile(req, res, db, sessionCredentials);
        } else {
            let signInPageUrl = `http://${req.headers.host}/`;
            redirectToOtherPage(res, signInPageUrl);
        }
    });
    
    function updateProfile(req, res, db, sessionCredentials) {
        let usersEmail = sessionCredentials.email;

        collectRequestBody(req)
        .then(profileDataToUpdateObj => {
            let updateQuery = createUpdateQuery(profileDataToUpdateObj);
            
            if (typeof updateQuery === 'object') {
                return updateUserInDbPassArgs(db, usersEmail, updateQuery);
            } else {
                throw new Error(dataToUpdateObj);
            }
        })
        .then(ifUpdateSuccesful => {
            sendObjToFrontEnd(res, {ifUpdateSuccesful});
        })
        .catch(e => {
            console.log(e);
            let endMsg = 'there has been an error check with the system admin';
            sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', endMsg, res)
        })
    }

    function createUpdateQuery(dataToUpdateObj) {
        if (dataToUpdateObj === {}) return 'no updates specified'

        let updateQuery = {
            $set : {}
        }

        if (dataToUpdateObj.usrName) {
            updateQuery.$set.usrName = dataToUpdateObj.usrName
        }

        if (dataToUpdateObj.location) {
            updateQuery.$set.location = dataToUpdateObj.location
        }

        if (dataToUpdateObj.description) {
            updateQuery.$set.description = dataToUpdateObj.description
        }

        if (dataToUpdateObj.interests) {
            updateQuery.$set.interests = dataToUpdateObj.interests
        }

        return updateQuery;        
    }

    function updateUserInDbPassArgs(db, usersEmail, updateQuery) {
        let findQuery = {email: usersEmail};
        let updateOpts = {returnOriginal : false};

        return updateUserInDb(db, findQuery, updateQuery, updateOpts);
    }
}

module.exports = updateProfileRoute;