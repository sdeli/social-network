const {logInUser, collectRequestBody, sendStatusMessageToFrontEnd, generateMemberId} = require('../../utils/utils.js');
const {checkIfUserExists, insertOneUserToDb} = require('../../../model/user-db-fns.js')

function signUpRoute(server, db) {
    let response;

    server.route('/sign-up', {method : 'POST'}, (req, res) => {
        signUpRouteCallBack(req, res);
    });

    async function signUpRouteCallBack(req, res) {
        response = res;

        let userDataJson = '';

        req.on('data', (chunk) => {
            userDataJson += chunk;
        });

        req.on('end', () => {
            userDataObj = JSON.parse(userDataJson);

            checkIfUserExists(db, userDataObj)
                .then(ifEmailExist => {
                    if (ifEmailExist) {
                        let msg = 'there has been a user with a same email adress';
                        sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', msg, res);
                    } else {
                        prepareMandatoryFields(userDataObj);

                        insertOneUserToDb(db, userDataObj)
                            .then((userCredentials) => {
                                console.log('user inserted');
                                logInUser(userCredentials, res);
                            }).catch(e => {
                                console.log(e);
                                let msg = `there has been an error: ${e}`;
                                sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', msg, res);
                            });
                    }
                }).catch(e => {
                    console.log(e);
                    let msg = `there has been an error: ${e}`;
                    sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', msg, res);
                });
        });
    }

    function prepareMandatoryFields(userDataObj) {
        if (!userDataObj.password) {
            return 'there is no password set'
        } else if (!userDataObj.usrName) {
            return 'there is no usrName set'
        } else if (!userDataObj.email) {
            return 'there is no email set'
        } else if (!userDataObj.profilePic) {
            userDataObj.profilePic = 'default_profile.png';
        } 

        userDataObj.memberId = generateMemberId(userDataObj.usrName);
    }
}

module.exports = signUpRoute;