const signOut = require('./moduls/sign-out/sign-out.js');
const removeFriend = require('./moduls/remove-friend/remove-friend.js');
const requestFriendship = require('./moduls/request-friendship/request-friendship.js');
const whitdrawFriendshipRequest = require('./moduls/whitdraw-friendship-request/whitdraw-friendship-request.js')

signOut();

requestFriendshipBtn = document.querySelector('#request_friendship_btn');
removeFriendBtn = document.querySelector('#remove-friend-btn');
whitdrawFriendshipReqBtn = document.querySelector('.cancel_friendship_request');

if (requestFriendshipBtn) {
    requestFriendship();
} else if (removeFriendBtn) {
    removeFriend();
} else if (whitdrawFriendshipReqBtn) {
    whitdrawFriendshipRequest()
}