const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();
const {redirectToOtherPage, sendObjToFrontEnd, sendStatusMessageToFrontEnd,
    collectRequestBody, getDate} = require('../../utils/utils.js');
const {getUserInfosFromDb} = require('../../../model/user-db-fns.js');
const {insertStatusDetailsToDb} = require('../../../model/user-status-db-fns.js');

function postUserStatusRoute(server ,db) {
    server.route('/post-status', {method : 'POST'}, (req, res) => {
        let sessionCredentials = cookieAuthObj.checkIfLoggedIn(req, 'user_auth_session')
        let isUserLoggedIn = sessionCredentials && typeof sessionCredentials !== 'string';
        
        if (isUserLoggedIn) {
            postUserStatus(req, res, sessionCredentials);
        } else {
            let signInPageUrl = `http://${req.headers.host}/`;
            redirectToOtherPage(res, signInPageUrl);
        }
    });
    
    function postUserStatus(req, res, sessionCredentials) {
        let usersEmail = sessionCredentials.email;

        Promise.all([ 
            collectRequestBody(req),
            getUserInfosFromDb(db, {email: usersEmail})    
        ])
        .then(resultsArr => {
            if (resultsArr[0].statusText) {
                let statusDetailsObj = createStatusDetailsObj(resultsArr);
                return insertStatusDetailsToDb(db, statusDetailsObj);
            } else {
                throw new Error('no text specified');
            }
        })
        .then(toDbinsertedStatusDetails => {
            sendObjToFrontEnd(res, toDbinsertedStatusDetails);
        })
        .catch(e => {
            if (e === 'no text specified') {
                sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', e, res)
                console.log(e);
            }
        })
    }

    function createStatusDetailsObj(resultsArr) {
        let statusDetailsObj = {
            usrName : resultsArr[1].usrName,
            usersDocId : resultsArr[1].docId,
            statusText : resultsArr[0].statusText,
            profilePicName : resultsArr[1].profilePicName,
            email : resultsArr[1].email,
            statusDate : getDate()
        }

    return statusDetailsObj;
    }
}

module.exports = postUserStatusRoute;