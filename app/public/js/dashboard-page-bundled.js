(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const signOut = require('./moduls/sign-out/sign-out.js');
const postStatus = require('./moduls/post-status/post-status.js');

postStatus();
signOut();
},{"./moduls/post-status/post-status.js":2,"./moduls/sign-out/sign-out.js":3}],2:[function(require,module,exports){
/*
   userStatusSchema = {
       usrEmail : String,
       usrStatus : String,
       usrName : String,
       date : Date
   }
*/

const {returnObjFromJson, clearFormFields} = require('../../utils/utils.js');

function postStatus() {
    let statusesTextarea = document.querySelector('#statuses_textarea');
    let submitStatusBtn = document.querySelector('#submit_status_button');
    let userStatusesOl = document.querySelector('.user_statuses');

    let statusParagraph = document.querySelector('.user_statuses .poster_name p');
    submitStatusBtn.addEventListener('click', function(e) {
        e.preventDefault;
        submitStatusBtn.disabled = true;

        let statusText = statusesTextarea.value;

        if (statusText !== '') {
            //submitStatusBtn.disabled = true;
            sendStatusDetailsToServer(JSON.stringify({statusText}));
            clearFormFields([statusesTextarea]);          
        } else {
            alert('Please specify some changes');
        }
    })

    function sendStatusDetailsToServer(statusText) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/post-status", true);

        xhttp.onload = function() {
            let statusDetailsObj = returnObjFromJson(this.response);

            if (this.readyState == 4 && typeof statusDetailsObj === 'object') {
                insertNewStatus(statusDetailsObj);

            } else {
                alert(this.response);
                submitStatusBtn.disabled = false;
            }
        };
        
        xhttp.send(statusText);
    }

    function insertNewStatus(statusDetailsObj) {
        let newStatusLiItem = document.createElement('li');
        newStatusLiItem.className = 'clearfix';
        userStatusesOl.insertBefore(newStatusLiItem, userStatusesOl.childNodes[0]);

        newStatusLiItem.innerHTML = `<img src=/users_profile_pic/${statusDetailsObj.profilePicName}>` +
                                    '<div class="poster_name">' +
                                        `<a href='/diff-user-profile-page/${statusDetailsObj.usersDocId}'>${statusDetailsObj.usrName}</a>` +
                                    '</div>' +
                                    `<p>${statusDetailsObj.statusText}</p>`;
                                        //`<p>${statusDetailsObj.statusDate}</p>` +
                                    
        submitStatusBtn.disabled = false;
    }
}

/*
<ol class="user_statuses">
<% for(var i = 0; i < userStatusArr.length; i++) {%>
    <li>
        <img src="" alt="">
        <div class="poster_name">
            <p><%= userStatusArr[i] %></p>
        </div>
    </li>
<% } %>
</ol>

*/

module.exports = postStatus;
},{"../../utils/utils.js":4}],3:[function(require,module,exports){
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
},{"../../utils/utils.js":4}],4:[function(require,module,exports){
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
},{}]},{},[1]);
