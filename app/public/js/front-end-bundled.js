(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const signUp = require('./js-modules/sign-up/sign-up.js');

signUp();

},{"./js-modules/sign-up/sign-up.js":2}],2:[function(require,module,exports){
function signUp() {
    let signUpForm = document.querySelector('form#sign_up_form');
    let signUpBtn = document.querySelector('input#register_user');
    let usrNameField = document.querySelector('input#name');
    let passwordField = document.querySelector('input#password');
    let emailField = document.querySelector('input#email');

    signUpBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('asd');
        let userDetailsJson = JSON.stringify({
            usrName : usrNameField.value,
            password : passwordField.value,
            email : emailField.value
        });


        postFeedback(userDetailsJson)
    });

    function postFeedback(userDetailsJson) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/sign-up", true);
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onload = function() {
            if (this.readyState == 4) {
                console.log(userDetailsJson);
                clearFormFields([
                    usrNameField,
                    passwordField,
                    emailField
                ]);
           }
        };
        
        xhttp.send(userDetailsJson);
    }

    function clearFormFields(formFieldsArr) {
        formFieldsArr.forEach(formField => {
            formField.value = '';
        });
    }
}

module.exports = signUp;
},{}]},{},[1]);
