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
            alert(this.response);
            signOutBtn.disabled = false;
        }
    }
}

module.exports = signOut;