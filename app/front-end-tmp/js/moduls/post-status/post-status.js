/*
   userStatusSchema = {
       usrEmail : String,
       usrStatus : String,
       usrName : String,
       date : Date
   }
*/

const {returnObjFromJson, clearFormFields} = require('../../utils/utils.js');

function postStatus() {
    let statusesTextarea = document.querySelector('#statuses_textarea');
    let submitStatusBtn = document.querySelector('#submit_status_button');
    let userStatusesOl = document.querySelector('.user_statuses');

    let statusParagraph = document.querySelector('.user_statuses .poster_name p');
    submitStatusBtn.addEventListener('click', function(e) {
        e.preventDefault;
        submitStatusBtn.disabled = true;

        let statusText = statusesTextarea.value;

        if (statusText !== '') {
            //submitStatusBtn.disabled = true;
            sendStatusDetailsToServer(JSON.stringify({statusText}));
            clearFormFields([statusesTextarea]);          
        } else {
            alert('Please specify some changes');
        }
    })

    function sendStatusDetailsToServer(statusText) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/post-status", true);

        xhttp.onload = function() {
            let statusDetailsObj = returnObjFromJson(this.response);

            if (this.readyState == 4 && typeof statusDetailsObj === 'object') {
                insertNewStatus(statusDetailsObj);

            } else {
                alert(this.response);
                submitStatusBtn.disabled = false;
            }
        };
        
        xhttp.send(statusText);
    }

    function insertNewStatus(statusDetailsObj) {
        let newStatusLiItem = document.createElement('li');
        newStatusLiItem.className = 'clearfix';
        userStatusesOl.insertBefore(newStatusLiItem, userStatusesOl.childNodes[0]);

        newStatusLiItem.innerHTML = `<img src=/users_profile_pic/${statusDetailsObj.profilePicName}>` +
                                    '<div class="poster_name">' +
                                        `<a href='/diff-user-profile-page/${statusDetailsObj.usersDocId}'>${statusDetailsObj.usrName}</a>` +
                                    '</div>' +
                                    `<p>${statusDetailsObj.statusText}</p>`;
                                        //`<p>${statusDetailsObj.statusDate}</p>` +
                                    
        submitStatusBtn.disabled = false;
    }
}

/*
<ol class="user_statuses">
<% for(var i = 0; i < userStatusArr.length; i++) {%>
    <li>
        <img src="" alt="">
        <div class="poster_name">
            <p><%= userStatusArr[i] %></p>
        </div>
    </li>
<% } %>
</ol>

*/

module.exports = postStatus;