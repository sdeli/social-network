/*
    registeredSessionsArr[
         {
            ecnrypted : asdaijower4bkx2chsef,
            email,
            password,
            key
        }
    ]
        encryptedCredentials : 696448d32a36d97931e3ca003df0b58394fb5a8eb282e8c8502e92,
        email : bgfkszmsdeli@gmail.com,
        password : asdd,
        ecnryptionKey : N$l7dYU
    });

    function setCookie(cookieName, cookiesValue, expirationDays, path) {
        var dateObj = new Date();
        dateObj.setTime(dateObj.getTime() + (expirationDays*24*60*60*1000));
        var expires = "expires="+ dateObj.toUTCString();
        document.cookie = cookieName + "=" + cookiesValue + ";" + expires + ";path=" + path;
    }
    setCookie('user_auth_session', '696448d32a36d97931e3ca003df0b58394fb5a8eb282e8c8502e92', 100, '/')
*/
const registerSession = require('./modules/registerSession/registerSession.js');
const checkIfLoggedIn = require('./modules/check-if-logged-in/check-if-logged-in.js');
const destroySession = require('./modules/destroySession/destroySession.js');

function createCookieAuthObj() {
    let cookieAuthSessionObj = {
        registerSession,
        registeredSessionsArr : [
            {
                encryptedCredentials : '696448d32a36d97931e3ca003df0b58394fb5a8eb282e8c8502e92',
                email : 'bgfkszmsdeli@gmail.com',
                password : 'asdd',
                ecnryptionKey : 'N$l7dYU'
            }
        ],
        checkIfLoggedIn,
        destroySession
    }
    
    return cookieAuthSessionObj;
}

module.exports = createCookieAuthObj;