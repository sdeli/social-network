const fs = require('fs');

const cookieAuthObj = require('../../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();
const {generateRandomStr, collectRequestBody, 
sendStatusMessageToFrontEnd, redirectToOtherPage} = require('../../utils/utils.js');
const {updateUserInDb} = require('../../../model/user-db-fns.js');
const {updateAllUserStatusesInDb} = require('../../../model/user-status-db-fns.js');

function updateProfileImageRoute(server, db) {
    server.route('/update-profile-image', {method : 'POST'}, (req, res) => {
        let sessionCredentials = cookieAuthObj.checkIfLoggedIn(req, 'user_auth_session')
        let isUserLoggedIn = sessionCredentials && typeof sessionCredentials !== 'string';
        
        if (isUserLoggedIn) {
            updateProfileImage(req, res, db, sessionCredentials);
        } else {
            let signInPageUrl = `http://${req.headers.host}/`;
            redirectToOtherPage(res, signInPageUrl);
        }
    });

    function updateProfileImage(req, res, db, sessionCredentials) {
        let usersEmail = sessionCredentials.email;
        let profImgName;

        collectRequestBody(req)
        .then(imageDetailsObj => {
            return saveImage(imageDetailsObj);
        })
        .then(resultedProfImgName => {
            profImgName = resultedProfImgName
            let updateQuery = getUpdateQuery(profImgName);

            return Promise.all([
                updateUserInDb(db, {email : usersEmail}, updateQuery),
                updateAllUserStatusesInDb(db, {email : usersEmail}, updateQuery)
            ]);
        })
        .then(() => {
            let profImgUrl = `/users_profile_pic/${profImgName}`
            sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', profImgUrl, res);
        })
        .catch(e => {
            sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', e, res);
        })
    }

    function saveImage(imageDetailsObj) {
        return new Promise((resolve, reject) => {
            let profImageBufferedData =Buffer.from(imageDetailsObj.body, 'base64');
            let extension = imageDetailsObj.extension;

            let newImgFilesId = generateRandomStr(7);
            let newImgFilesName = `profile-img-${newImgFilesId}.${extension}`
            let newImgFilesPath = `../front-end-tmp/img/${newImgFilesName}`;

            fs.writeFile(newImgFilesPath, profImageBufferedData, (err) => {
                if (err) reject(err);
                resolve(newImgFilesName);
            });
        })
    }

    function getUpdateQuery(profImgName) {
        let updateQuery = {
            $set : {
                profilePicName : profImgName
            }
        }

        return updateQuery;
    }
}

module.exports = updateProfileImageRoute;