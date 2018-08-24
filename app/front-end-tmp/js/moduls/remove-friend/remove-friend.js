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