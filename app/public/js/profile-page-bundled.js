(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function acceptRequest() {
    let acceptFriendRequestBtns = document.querySelectorAll('.friend_requests__cont__accept_request_btn');
    let activatedBtn;

    function startModule() {
        acceptFriendRequestBtns.forEach(function(acceptFriendRequestBtn) {
            acceptFriendRequestBtn.addEventListener('click', function() {
                //acceptFriendRequestBtn.disabled = true;
                activatedBtn = acceptFriendRequestBtn;

                let friendsDocId = this.getAttribute('data-docid');
                sendRequestacceptedSignalToServer(friendsDocId);
            });
        });
    }

    function sendRequestacceptedSignalToServer(friendsDocId) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/accept-request", true);
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onload = function() {
            let ifRequestSuccesful = this.response === 'changes made in db succesfully';

            if (this.readyState === 4 && this.statusText === 'OK' && ifRequestSuccesful) {
                swapFriendFromFrRequestToFriendsDiv(friendsDocId)
                //saveProfileBtn.disabled = false;
            } else {
                alert(`There has been an error here unfortunately:\n${this.response}`);
                //saveProfileBtn.disabled = false;
            }
        }
        
        xhttp.send(friendsDocId);
    }

    function swapFriendFromFrRequestToFriendsDiv(friendsDocId) {
        let friendsContainer = document.querySelector('.friends')
        let friendsh3 = document.querySelector('.friends h3')

        let friendRequestsDiv = document.querySelector('.friend_requests');
        let friendRequestsH3 = document.querySelector('.friend_requests h3');
        let friendRequestersDiv = activatedBtn.parentElement;

        friendRequestsDiv.removeChild(friendRequestersDiv);
        friendRequestsH3.innerText = "All friend requests have been accepted";
        friendsContainer.appendChild(friendRequestersDiv);

        if (friendsh3.innerText === 'You Have No friends At the moment') {
            friendsh3.innerText = 'congratulations, you have your fierst friend';
        }
    }

    startModule();
}

module.exports = acceptRequest;
},{}],2:[function(require,module,exports){
const {returnObjFromJson, clearFormFields} = require('../../utils/utils.js');

function editProfile() {
    let saveProfileBtn = document.querySelector('#save_profile_button');

    let usrNameDiv = document.querySelector('#profile_picture_div h2');
    let locationDiv = document.querySelector('#profile_picture_div h4');
    let descriptionP = document.querySelector('#about_me p');
    let interestsP = document.querySelector('#interests p');

    let updateForm = {
        usrNameInput : document.querySelector('#edit_profile_form input[name=\'name\']'),
        locationInput : document.querySelector('#edit_profile_form input[name=\'location\']'),
        descriptionInput : document.querySelector('#edit_profile_form textarea[name=\'description\']'),
        interestsInput : document.querySelector('#edit_profile_form textarea[name=\'interests\']')
    }

    function startModule() {
        saveProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveProfileBtn.disabled = true;

            let profileUpdatesObj = {
                usrName : updateForm.usrNameInput.value,
                location : updateForm.locationInput.value,
                description : updateForm.descriptionInput.value,
                interests : updateForm.interestsInput.value
            }

            deletePropsWithNoValue(profileUpdatesObj);
            let hasProperty = Object.keys(profileUpdatesObj).length > 0;

            if (hasProperty) {
                sendProfileUpdatesToServer(profileUpdatesObj);
                clearFormFields(Object.values(updateForm));
            } else {
                alert('please specify some updates');
            }
        });
    }

    function sendProfileUpdatesToServer(profileUpdatesObj) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/update-user-profile", true);
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onload = function() {
            let response = returnObjFromJson(this.response);
            let wasUpdateSuccesful = typeof response !== 'string' && response.ifUpdateSuccesful;

            if (this.readyState === 4 && this.statusText === 'OK' && wasUpdateSuccesful) {
                displayUpdates(profileUpdatesObj);
                saveProfileBtn.disabled = false;
            } else {
                alert(`There has been an error here unfortunately:\n${this.response}`);
                saveProfileBtn.disabled = false;
            }
        }
        
        xhttp.send(JSON.stringify(profileUpdatesObj));
    }

    function deletePropsWithNoValue(profileUpdatesObj) {
        for (key in profileUpdatesObj) {
            if (profileUpdatesObj[key] === '') {
                delete profileUpdatesObj[key];               
            }
        }
    }

    function displayUpdates(profileUpdatesObj) {
        if (profileUpdatesObj.usrName) {
            usrNameDiv.innerHTML = `Name: ${profileUpdatesObj.usrName}`;
        }

        if (profileUpdatesObj.location) {
            locationDiv.innerHTML = `Location: ${profileUpdatesObj.location}`;
        }

        if (profileUpdatesObj.description) {
            descriptionP.innerHTML = profileUpdatesObj.description;
        }

        if (profileUpdatesObj.interests) {
            interestsP.innerHTML = profileUpdatesObj.interests;
        }
    }

    startModule();
}

module.exports = editProfile;
},{"../../utils/utils.js":7}],3:[function(require,module,exports){
const {clearFormFields, checkIfHasSignedInCookie} = require('../../utils/utils.js');

function showAndHideProfEditArea() {
    let editProfileBtn = document.querySelector('#edit_profile_button');
    let cancelEditProfileBtn = document.querySelector('#cancel_edit_profile');
    let editProfileForm = document.querySelector('#edit_profile_form');

    function startModule() {
        editProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (checkIfHasSignedInCookie) {
                showEditProfileForm();
            } else {
                alert('You are currently not signed in \nPlease Sign In')
            }
        });

        cancelEditProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (checkIfHasSignedInCookie) {
                hideEditProfileForm();
            } else {
                alert('You are currently not signed in \nPlease Sign In')
            }
        })
    }

    function showEditProfileForm() {
        editProfileFormDisplayValue = window.getComputedStyle(editProfileForm, null).getPropertyValue("display");

        if (editProfileFormDisplayValue === 'none') {
            editProfileBtn.disabled = true;
            editProfileForm.style.display = 'block'
        }
    }

    function hideEditProfileForm() {
        editProfileAreaDisplayValue = window.getComputedStyle(editProfileForm, null).getPropertyValue("display");

        if (editProfileAreaDisplayValue === 'block') {
            editProfileBtn.disabled = false;
            clearEditProfileFormFields();
            editProfileForm.style.display = 'none'
        }
    }
    
    function clearEditProfileFormFields() {
        let profileUpdatesObj = {
            usrName : document.querySelector('#edit_profile_form input[name=\'name\']'),
            location : document.querySelector('#edit_profile_form input[name=\'location\']'),
            description : document.querySelector('#edit_profile_form textarea[name=\'description\']'),
            interests : document.querySelector('#edit_profile_form textarea[name=\'interests\']')
        }

        clearFormFields(Object.values(profileUpdatesObj));
    }

    startModule();
}

module.exports = showAndHideProfEditArea;
},{"../../utils/utils.js":7}],4:[function(require,module,exports){
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
},{"../../utils/utils.js":7}],5:[function(require,module,exports){
const {checkIfHasSignedInCookie} = require('../../utils/utils.js');

function uploadProfileImage() {
    let profileImageInput = document.querySelector('#upload_profile_pic');
    let profilePictureDiv = document.querySelector('#profile_picture_div');

    function startModule() {
        profileImageInput.addEventListener('click', function() {
            if (!checkIfHasSignedInCookie()) {
                alert('you are not logged in please log in');
            }
        })

        profileImageInput.addEventListener('change', function() {
            let profileImage = profileImageInput.files[0];

            let reader  = new FileReader();
            reader.readAsDataURL(profileImage)
            reader.onload = function() {
                encodedImage = reader.result;
                let imageDataJson = createImgDataJson(encodedImage)

                sendProfileImageToServer(imageDataJson)
            };
        })
    }

    function createImgDataJson(encodedImage) {
        let imageDetailsArr = encodedImage.split('base64,')

        let extension = imageDetailsArr[0].split('/')[1];
        extension = extension.slice(0, extension.length - 1);

        let body = imageDetailsArr[1];

        let imageDataObj = {
                extension,
                body : imageDetailsArr[1]
        }

        return JSON.stringify(imageDataObj); 
    }

    function sendProfileImageToServer(imageDataJson) {
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", "/update-profile-image", true);
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onload = function() {
            let profImageUrl = this.response;
            isNotError = profImageUrl.indexOf('/') === 0;

            if (this.readyState === 4 && this.statusText === 'OK' && isNotError) {
                updateProfImage(profImageUrl);
            } else {
                alert(this.response);
            }
        }
                
        xhttp.send(imageDataJson);
    }

    function updateProfImage(profImageUrl) {
        extractOldImage()
        appendNewImage(profImageUrl);
    }

    function extractOldImage() {
        let oldImage = profilePictureDiv.children[2]
        profilePictureDiv.removeChild(oldImage); 
    }

    function appendNewImage(profImageUrl) {
        let newImage = document.createElement('img');
        newImage.src = profImageUrl;

        profilePictureDiv.appendChild(newImage);
    }

    startModule();
}

module.exports = uploadProfileImage


},{"../../utils/utils.js":7}],6:[function(require,module,exports){
const signOut = require('./moduls/sign-out/sign-out.js');
const editProfile = require('./moduls/edit-profile/edit-profile.js');
const showAndHideProfEditArea = require('./moduls/show-and-hide-edit-profile/show-and-hide-edit-profile.js');
const uploadProfileImage = require('./moduls/upload-profile-picture/upload-profile-img.js');
const acceptRequest = require('./moduls/accept-request/accept-request.js');

showAndHideProfEditArea();
editProfile();
uploadProfileImage();
signOut();
acceptRequest();
},{"./moduls/accept-request/accept-request.js":1,"./moduls/edit-profile/edit-profile.js":2,"./moduls/show-and-hide-edit-profile/show-and-hide-edit-profile.js":3,"./moduls/sign-out/sign-out.js":4,"./moduls/upload-profile-picture/upload-profile-img.js":5}],7:[function(require,module,exports){
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
},{}]},{},[6]);
