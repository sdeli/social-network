const {logInUser, collectRequestBody, sendStatusMessageToFrontEnd, generateRandomStr} = require('../../utils/utils.js');
const {checkIfUserExists, insertOneUserToDb} = require('../../../model/user-db-fns.js')

function signUpRoute(server, db) {
    server.route('/sign-up', {method : 'POST'}, (req, res) => {
        let userDataObj;

        collectRequestBody(req)
        .then(resolvedUserDataObj => {
            userDataObj = resolvedUserDataObj;

            return checkIfUserExists(db, userDataObj);
        })
        .then(ifUserExist => {
            return processUserInsertionToDb(db, ifUserExist, userDataObj, res);
        })
        .then((userCredentials) => {
            console.log('user inserted');
            logInUser(userCredentials, res);
        })
        .catch(e => {
            console.log(e);
            let msg = `there has been an error: ${e}`;
            sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', msg, res);
        });

    });

    function processUserInsertionToDb(db, ifUserExist, userDataObj, res) {
        if (ifUserExist) {
            throw new Error('one or both of these credentials are already in use');
        } else {
            let isUserDataObjFine = prepareMandatoryFields(userDataObj);

            if (isUserDataObjFine === true) {
                return insertOneUserToDb(db, userDataObj)
            } else {
                throw new Error(isUserDataObjFine);
            }
        }
    }

    function prepareMandatoryFields(userDataObj) {
        if (!userDataObj.password) {
            return 'there is no password set'
        }

        if (!userDataObj.usrName) {
            return 'there is no usrName set'
        }

        if (!userDataObj.email) {
            return 'there is no email set'
        }

        userDataObj.docId = `doc-id-${generateRandomStr(7)}`;
        userDataObj.profilePicName = 'default_profile.png';
        userDataObj.localtion = 'nothing specified';
        userDataObj.interests = 'nothing specified';
        userDataObj.description = 'nothing specified';
        userDataObj.friendRequests = [];
        userDataObj.friends = [];
        
        return true;
    }
}

module.exports = signUpRoute;

