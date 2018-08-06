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
            console.log(this);
            if (this.readyState === 4 && this.statusText === 'OK') {
                setCookie('user_auth_session', this.response, 100, '/')
                document.location.replace('/');
           }
        };

        xhttp.onload = function() {
            let cookieAuthDetailsObj = returnObjFromJson(this.response);

            if (this.readyState === 4 && this.statusText === 'OK' && cookieAuthDetailsObj) {
                let cookieName = cookieAuthDetailsObj.name;
                let encriptedCredentials = cookieAuthDetailsObj.encriptedCredentials;

                setCookie(cookieName, encriptedCredentials, 100, '/');
                window.location.replace(`http://${window.location.hostname}:3000/dashboard`);
            } else {
                console.log(this.response);
                signUpBtn.disabled = false;
            }
        }
        
        xhttp.send(userDetailsJson);
    }
}

module.exports = signUp;