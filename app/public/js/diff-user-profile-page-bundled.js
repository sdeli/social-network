(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const signOut = require('./moduls/sign-out/sign-out.js');
const removeFriend = require('./moduls/remove-friend/remove-friend.js');
const requestFriendship = require('./moduls/request-friendship/request-friendship.js');
const whitdrawFriendshipRequest = require('./moduls/whitdraw-friendship-request/whitdraw-friendship-request.js')

signOut();

requestFriendshipBtn = document.querySelector('#request_friendship_btn');
removeFriendBtn = document.querySelector('#remove-friend-btn');
whitdrawFriendshipReqBtn = document.querySelector('.cancel_friendship_request');

if (requestFriendshipBtn) {
    requestFriendship();
} else if (removeFriendBtn) {
    removeFriend();
} else if (whitdrawFriendshipReqBtn) {
    whitdrawFriendshipRequest()
}
},{"./moduls/remove-friend/remove-friend.js":2,"./moduls/request-friendship/request-friendship.js":3,"./moduls/sign-out/sign-out.js":4,"./moduls/whitdraw-friendship-request/whitdraw-friendship-request.js":5}],2:[function(require,module,exports){
const requestFriendship = require('../request-friendship/request-friendship.js');

function removeFriend() {
    let removeFriendBtn = document.querySelector('#remove-friend-btn');
    let friendsDocId;

    function startModule() {
        removeFriendBtn.addEventListener('click', function() {
            friendsDocId = removeFriendBtn.getAttribute('data-docid');
            sendremoveFriendSignalToServer(friendsDocId)
        })
    }

    function sendremoveFriendSignalToServer(friendsDocId) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/remove-friend", true);

        xhttp.onload = function() {
            let wasfriendRemovalSuccesful = this.response === 'friend removal was succesful';


            if (this.readyState == 4 && wasfriendRemovalSuccesful) {
                swapRemoveFrBtnToRequestFriendshipBtn();
            } else {
                alert(this.response);
            }
        };
        
        xhttp.send(friendsDocId);
    }

    function swapRemoveFrBtnToRequestFriendshipBtn() {
        let btnsContainerDiv = removeFriendBtn.parentElement;
        btnsContainerDiv.removeChild(removeFriendBtn);

        let requestFriendshipBtn = document.createElement('button');
        btnsContainerDiv.appendChild(requestFriendshipBtn);
        requestFriendshipBtn.outerHTML = `<button id=\"request_friendship_btn\" data-docid=\'${friendsDocId}\'>Request Friendship</button>`
        
        requestFriendship();
    }

    startModule();
}

module.exports = removeFriend;
},{"../request-friendship/request-friendship.js":3}],3:[function(require,module,exports){
const whitdrawFriendshipRequest = require('../whitdraw-friendship-request/whitdraw-friendship-request.js');

function requestFriendship() {
    let requestFriendshipBtn = document.querySelector('#request_friendship_btn');

    function startModule() {
        requestFriendshipBtn.addEventListener('click', function() {
            let diffUsersDocId = requestFriendshipBtn.getAttribute('data-docid');
            sendRequestFriendshipSignalToServer(diffUsersDocId)
        })
    }

    function sendRequestFriendshipSignalToServer(diffUsersDocId) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/request-friendship", true);

        xhttp.onload = function() {
            ifFriendshipRequested = this.response === 'friend requesting was succesful';

            if (this.readyState == 4 && ifFriendshipRequested) {
                displaycancelFrRequestArea(diffUsersDocId);
            } else {
                alert(this.response);
            }
        };

        
        xhttp.send(diffUsersDocId);
    }

    function displaycancelFrRequestArea(diffUsersDocId) {
        let profileInfoH3 = document.querySelector('.friendship_status h3')

        profileInfoH3.innerText = 'Friendship Requested'        
        requestFriendshipBtn.outerHTML = `<button type="button" class="cancel_friendship_request" data-docid='${diffUsersDocId}'>Whitdraw FriendShip Request</button>`;

        whitdrawFriendshipRequest();
    }

    startModule();
}

module.exports = requestFriendship;
},{"../whitdraw-friendship-request/whitdraw-friendship-request.js":5}],4:[function(require,module,exports){
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
},{"../../utils/utils.js":6}],5:[function(require,module,exports){
//const requestFriendship = require('../request-friendship/request-friendship.js');
function whitdrawFriendshipRequest() {
    let whitdrawFrRequestBtn = document.querySelector('.cancel_friendship_request');

    function startModule() {
        whitdrawFrRequestBtn.addEventListener('click', function() {
            let diffUsersDocId = whitdrawFrRequestBtn.getAttribute('data-docid');
            sendWhitdrawFrReqSignalToServer(diffUsersDocId)
        })
    }

    function sendWhitdrawFrReqSignalToServer(diffUsersDocId) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/whitdraw-friendship-request", true);

        xhttp.onload = function() {
            ifWhitdrawsWasSuccesful = this.response === 'FriendshipReqs whitdrawal was succesful';

            if (this.readyState == 4 && ifWhitdrawsWasSuccesful) {
                showRequestFriendshipArea(diffUsersDocId);
            } else {
                alert(this.response);
            }
        };
        
        xhttp.send(diffUsersDocId);
    }

    function showRequestFriendshipArea(diffUsersDocId) {
        let profileInfoH3 = document.querySelector('.friendship_status h3')

        profileInfoH3.innerText = 'You are not friends here'        
        whitdrawFrRequestBtn.outerHTML = `<button id="request_friendship_btn" data-docid='${diffUsersDocId}'>Request Friendship</button>`;

        const requestFriendship = require('../request-friendship/request-friendship.js');
        requestFriendship();
    }

    startModule();
}

module.exports = whitdrawFriendshipRequest
},{"../request-friendship/request-friendship.js":3}],6:[function(require,module,exports){
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
