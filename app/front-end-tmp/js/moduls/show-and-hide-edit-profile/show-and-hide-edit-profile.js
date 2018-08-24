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