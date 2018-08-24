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