const {logInUser, sendStatusMessageToFrontEnd} = require('../../utils/utils.js');
const {checkIfUserExists} = require('../../../model/user-db-fns.js')

function signInRoute(server, db) {
    let response;

    server.route('/sign-in', {method : 'POST'}, (req, res) => {
        response = res;

        let userDataJson = '';

        req.on('data', (chunk) => {
            userDataJson += chunk;
        });

        req.on('end', () => {
            userDataObj = JSON.parse(userDataJson);

            checkIfUserExists(db, userDataObj)
                .then(userCredentials => {
                    if (userCredentials) {
                        logInUser(userCredentials, res);
                    } else {
                        let msg = 'incorrect credentails';
                        sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', msg, res);
                    }
                }).catch(e => {
                    console.log(e);
                    let msg = `there has been an error: ${e}`;
                    sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', msg, res);
                });
        });
    });
}

module.exports = signInRoute;