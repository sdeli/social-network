const cookieAuthObj = require('../../../cookie-auth/cookie-auth-singleton.js').getCookieAuthObj();

function logInUser(userCredentials, res) {
    let email = userCredentials.email;
    let password = userCredentials.password;

    let encriptedCredentials = cookieAuthObj.registerSession(email, password);
    sendEncryptCredentilalsToFrontEnd(encriptedCredentials, res);

}

function respondThisUserDoesntExistAnymore(res) {
    let html = '<h1>this user doesnt exist anymore</h1>';
    sendStatusMessageToFrontEnd(200, 'OK', 'text/html', html, res)
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

function sendObjToFrontEnd(res, obj) {
    let json = JSON.stringify(obj);
    sendStatusMessageToFrontEnd(200, 'OK', 'application/json', json, res);
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

function generateRandomStr(strLength) {
  var randomStr = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%$@!^&*()";

  for (var i = 0; i < strLength - 1; i++) {
    randomStr += possible.charAt(Math.floor(Math.random() * possible.length));
  }
    
  return randomStr;
}

function collectRequestBody(req) {
    return new Promise((resolve, reject) => {
        let requestBodyUnknownType = '';

        req.on('data', (chunk) => {
            requestBodyUnknownType += chunk;
        });

        req.on('end', () => {
            try {
                let requestBodyObj = JSON.parse(requestBodyUnknownType);
                resolve(requestBodyObj);
            } catch(e) {
                resolve(requestBodyUnknownType);
            }
        });

        req.on('error', (err) => {
            console.log(err);
            reject(err);
        });
    });
}

function getDate() {
    let today = new Date();
    //let hh = today.getHours()
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 

    today = mm + ' ' + dd + ' ' + yyyy;
    return today
}

module.exports = {
    logInUser,
    redirectToOtherPage,
    sendStatusMessageToFrontEnd,
    sendCookieDetailsToFrontEnd,
    generateMemberId,
    generateRandomStr,
    collectRequestBody,
    sendObjToFrontEnd,
    getDate,
    respondThisUserDoesntExistAnymore
}