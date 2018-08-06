(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const signOut = require('./moduls/sign-out/sign-out.js');

signOut();
},{"./moduls/sign-out/sign-out.js":2}],2:[function(require,module,exports){
const {returnObjFromJson, destroyCookie} = require('../../utils/utils.js');

function signOut() {
    let signOutBtn = document.querySelector('input#log_out_user');

    signOutBtn.addEventListener('click', function(e) {
        e.preventDefault();

        signOutBtn.disabled = true;
        sendSignOutReqToServer();
    });

    function sendSignOutReqToServer() {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/sign-out", true);

        xhttp.onload = function() {
            logOutTheUser.call(this);
        }
        
        xhttp.send();
    }

    function logOutTheUser() {
        console.log(this);
        let cookieToDestroyDetailsObj = returnObjFromJson(this.response);

        if (this.readyState === 4 && this.statusText === 'OK' && cookieToDestroyDetailsObj) {
            let cookieName = cookieToDestroyDetailsObj.cookieName;
            let cookiesValue = cookieToDestroyDetailsObj.encryptedCreds;

            destroyCookie(cookieName, cookiesValue, '/');
            window.location.replace(`http://${window.location.hostname}:3000/`);
        } else {
            console.log(this);
            signOutBtn.disabled = false;
        }
    }
}

module.exports = signOut;
},{"../../utils/utils.js":3}],3:[function(require,module,exports){
function setCookie(cookieName, cookiesValue, expirationDays, path) {
    var dateObj = new Date();
    dateObj.setTime(dateObj.getTime() + (expirationDays*24*60*60*1000));
    var expires = "expires="+ dateObj.toUTCString();
    document.cookie = cookieName + "=" + cookiesValue + ";" + expires + ";path=" + path;
}

function destroyCookie(cookieName, cookiesValue, path) {
    var dateObj = new Date();
    document.cookie = `${cookieName}=${cookiesValue}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function returnObjFromJson(str) {
    try {
        var obj = JSON.parse(str);
    } catch (e) {
        return false;
    }

    return obj;
}

function clearFormFields(formFieldsArr) {
    formFieldsArr.forEach(formField => {
        formField.value = '';
    });
}

module.exports = {
    setCookie,
    returnObjFromJson,
    clearFormFields,
    destroyCookie
}
},{}]},{},[1]);
