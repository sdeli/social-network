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