const {sendCookieDetailsToFrontEnd, sendStatusMessageToFrontEnd} = require('../../utils/utils.js');
const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();

function signOutRoute(server, db) {
    let response;

    server.route('/sign-out', {method : 'POST'}, (req, res) => {
        let cookieToDestroyOnFrontEnd = cookieAuthObj.destroySession(req, 'user_auth_session');

        if (typeof cookieToDestroyOnFrontEnd === 'object') {
            let name = 'user_auth_session';
            let encryptedCreds = cookieToDestroyOnFrontEnd.encryptedCredentials;
            sendCookieDetailsToFrontEnd(res, name, encryptedCreds);
        } else {
            let endMsg = `there ha been an error: ${cookieToDestroyOnFrontEnd}`
            sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', endMsg, res);
        }
    });
}

module.exports = signOutRoute;