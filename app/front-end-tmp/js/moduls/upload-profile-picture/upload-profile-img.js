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

