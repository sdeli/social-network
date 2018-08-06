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
                console.log(this.response);
                signInBtn.disabled = false;
            }
        }
        
        xhttp.send(userDetailsJson);
    }
}

module.exports = signIn;