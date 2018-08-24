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