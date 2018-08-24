(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {setCookie, returnObjFromJson, clearFormFields} = require('../../utils/utils.js');

function signIn() {
    let signInForm = document.querySelector('form#sign_in_form');
    let signInBtn = document.querySelector('form#sign_in_form input[type=\"button\"]');
    let usrEmailField = document.querySelector('input#usr_email');
    let usrpasswordField = document.querySelector('input#usr_password');

    signInBtn.addEventListener('click', function(e) {
        e.preventDefault();
        signInBtn.disabled = true;
        console.log('asd');
        let userDetailsJson = JSON.stringify({
            password : usrpasswordField.value,
            email : usrEmailField.value
        });


        sendCredentialsToServer(userDetailsJson)
    });


    function sendCredentialsToServer(userDetailsJson) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/sign-in", true);
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onload = function() {
            console.log(this);
            let cookieAuthDetailsObj = returnObjFromJson(this.response);

            if (this.readyState === 4 && this.statusText === 'OK' && cookieAuthDetailsObj) {
                let cookieName = cookieAuthDetailsObj.name;
                let encriptedCredentials = cookieAuthDetailsObj.encriptedCredentials;

                setCookie(cookieName, encriptedCredentials, 100, '/');
                window.location.replace(`http://${window.location.hostname}:3000/dashboard`);
            } else {
                alert(this.response);
                signInBtn.disabled = false;
            }
        }
        
        xhttp.send(userDetailsJson);
    }
}

module.exports = signIn;
},{"../../utils/utils.js":4}],2:[function(require,module,exports){
const {setCookie, returnObjFromJson} = require('../../utils/utils.js');

function signUp() {
    let signUpForm = document.querySelector('form#sign_up_form');
    let signUpBtn = document.querySelector('input#register_user');
    let usrNameField = document.querySelector('input#name');
    let passwordField = document.querySelector('input#password');
    let emailField = document.querySelector('input#email');

    signUpBtn.addEventListener('click', function(e) {
        e.preventDefault();
        signUpBtn.disabled = true;

        let userDetailsJson = JSON.stringify({
            usrName : usrNameField.value,
            password : passwordField.value,
            email : emailField.value
        });


        sendCredentialsToServer(userDetailsJson)
    });

    function sendCredentialsToServer(userDetailsJson) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/sign-up", true);
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onload = function() {
            let cookieAuthDetailsObj = returnObjFromJson(this.response);

            if (this.readyState === 4 && this.statusText === 'OK' && cookieAuthDetailsObj) {
                let cookieName = cookieAuthDetailsObj.name;
                let encriptedCredentials = cookieAuthDetailsObj.encriptedCredentials;

                setCookie(cookieName, encriptedCredentials, 100, '/');
                window.location.replace(`http://${window.location.hostname}:3000/dashboard`);
            } else {
                alert(this.response);
                signUpBtn.disabled = false;
            }
        }
        
        xhttp.send(userDetailsJson);
    }
}

module.exports = signUp;
},{"../../utils/utils.js":4}],3:[function(require,module,exports){
const signUp = require('./moduls/sign-up/sign-up.js');
const signIn = require('./moduls/sign-in/sign-in.js');

signIn();
signUp();

},{"./moduls/sign-in/sign-in.js":1,"./moduls/sign-up/sign-up.js":2}],4:[function(require,module,exports){
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

function checkIfHasSignedInCookie() {
    var ifHasSignedInCookie = document.cookie.indexOf("user_auth_session") >= 0;

    if (ifHasSignedInCookie) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    setCookie,
    returnObjFromJson,
    clearFormFields,
    destroyCookie,
    clearFormFields,
    checkIfHasSignedInCookie
}
},{}]},{},[3]);
