const {logInUser, sendStatusMessageToFrontEnd, collectRequestBody} = require('../../utils/utils.js');
const {checkIfUserExists} = require('../../../model/user-db-fns.js')

function signInRoute(server, db) {
    let response;

    server.route('/sign-in', {method : 'POST'}, (req, res) => {
        let userDataObj;

        collectRequestBody(req)
        .then(resolvedUserDataObj => {
            userDataObj = resolvedUserDataObj;
            return checkIfUserExists(db, userDataObj);
        })
        .then(ifUserExist => {
            if (ifUserExist) {
                logInUser(ifUserExist, res);
            } else {
                throw new Error('incorrect credentails')
            }
        })
        .catch(e => {
            console.log(e);
            sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', e.message, res);
        });
    });
}

module.exports = signInRoute;