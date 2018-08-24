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