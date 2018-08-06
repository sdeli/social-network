const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();
const {redirectToOtherPage} = require('../../utils/utils.js');
const {getUserInfosFromDb} = require('../../../model/user-db-fns.js');
const {insertOneUserStatusToDb} = require('../../../model/user-status-db-fns.js');

function postUserStatusRoute(server ,db) {
    server.route('/post_status', {method : 'GET'}, (req, res) => {
        let sessionCredentials = cookieAuthObj.checkIfLoggedIn(req, 'user_auth_session')
        let isUserLoggedIn = sessionCredentials && typeof sessionCredentials !== 'string';
        
        if (isUserLoggedIn) {
            postUserStatus(req, res, db, sessionCredentials);
        } else {
            let signInPageUrl = `http://${req.headers.host}/`;
            redirectToOtherPage(res, signInPageUrl);
        }
    });
    
    async function postUserStatus(res, db, sessionCredentials) {
        let usersEmail = sessionCredentials.email;

        let statusDetailsObj = await collectRequestBody(req);
        let userInfos = await getUserInfosFromDb(db, {email: usersEmail})    

        let statusDetailsObj = {
            usrName : userInfos.usrName,
            usrStatusText : statusDetailsObj.statusText,
            profilePicName : userInfos.profilePic,
            statusDate : getDate()
        }

        sendStatusDetailsToFrontEnd(statusDetailsObj);
    }

    function sendStatusDetailsToFrontEnd() {
        res.writeHead(200, 'OK', {contentType : 'application/json'});
        res.end();
    }
}

module.exports = postUserStatusRoute;