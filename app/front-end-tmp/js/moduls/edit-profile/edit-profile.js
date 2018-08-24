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