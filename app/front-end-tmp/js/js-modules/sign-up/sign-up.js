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