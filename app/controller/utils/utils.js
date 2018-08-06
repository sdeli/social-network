const cookieAuthObj = require('../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();

function logInUser(userCredentials, res) {
    let email = userCredentials.email;
    let password = userCredentials.password;

    let encriptedCredentials = cookieAuthObj.registerSession(email, password);
    sendEncryptCredentilalsToFrontEnd(encriptedCredentials, res);

}

function sendEncryptCredentilalsToFrontEnd(encriptedCredentials, res) {
    cookieDetailsJson = JSON.stringify({
        name : 'user_auth_session',
        encriptedCredentials
    });
    
    sendStatusMessageToFrontEnd(200, 'OK', 'application/json', cookieDetailsJson, res);
}

function sendCookieDetailsToFrontEnd(res, cookieName, encryptedCreds) {
    cookieDetailsJson = JSON.stringify({
        cookieName,
        encryptedCreds
    });
    
    sendStatusMessageToFrontEnd(200, 'OK', 'application/json', cookieDetailsJson, res);
}

function sendStatusMessageToFrontEnd(statusCode, StatusMessage, ContentType, endMsg, res){
    res.writeHead(statusCode, StatusMessage, {contentType : ContentType});
    res.end(endMsg);
}

function returnObjFromJson(str) {
    try {
        var obj = JSON.parse(str);
    } catch (e) {
        return false;
    }

    return obj;
}

function redirectToOtherPage(res, otherPageUrl) {
    res.writeHead(302, {
        'location' : otherPageUrl
    });

    res.end();
}

function generateMemberId(usrName) {
  var randomStr = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%$@!^&*()";

  for (var i = 0; i < 7 - 1; i++) {
    randomStr += possible.charAt(Math.floor(Math.random() * possible.length));
  }
    
  return `${usrName}-${randomStr}`;
}

function collectRequestBody(req) {
    return new Promise((resolve, reject) => {
        let requestBodyJson = '';

        req.on('data', (chunk) => {
            requestBodyJson += chunk;
        });

        req.on('end', () => {
            let requestBodyObj = JSON.parse(requestBodyJson);
            resolve(requestBodyObj)
        });

        req.on('error', (err) => {
            console.log(err);
            reject(err);
        });
    });
}

module.exports = {
    logInUser,
    redirectToOtherPage,
    sendStatusMessageToFrontEnd,
    sendCookieDetailsToFrontEnd,
    generateMemberId,
    collectRequestBody
}