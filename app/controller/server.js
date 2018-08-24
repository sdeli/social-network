const {MongoClient} = require('mongodb');
const ejs = require('ejs');

const serverApp = require('../../server-app/server-singleton.js');
const signInPageRoute = require('./routes/get-routes/sing-in-page-route.js');
const dashboardPageRoute = require('./routes/get-routes/user-dashboard-route.js');
const sendProfilePicRoute = require('./routes/get-routes/get-profile-pic-route.js');
const updateProfileImageRoute = require('./routes/post-routes/update-prof-image-route.js');
const requestFriendshipRoute = require('./routes/post-routes/request-friendship-route.js');
const acceptFriendRequestRoute = require('./routes/post-routes/accept-request-route.js');
const whitdrawFriendshipRequestRoute = require('./routes/post-routes/whitdraw-friendship-request-route.js');
const diffUsersProfilePageRoute = require('./routes/get-routes/diff-users-profile-page-route.js');
const removeFriendFromFriendsRoute = require('./routes/post-routes/remove-friend-route.js');
const postUserStatusRoute = require('./routes/post-routes/post-user-status-route.js');
const updateProfileRoute = require('./routes/post-routes/update-profile-route.js');
const userProfilePageRoute = require('./routes/get-routes/user-profile-page-route.js');
const signUpRoute = require('./routes/post-routes/sign-up-route.js');
const signInRoute = require('./routes/post-routes/sign-in-route.js');
const signOutRoute = require('./routes/post-routes/sign-out-route.js');
const fourOfourRoute = require('./routes/get-routes/user-dashboard-route.js');

const port = 3000;

const dbName = 'social-network';
const dbUrl = `mongodb://localhost:27017/${dbName}`;
let db;

var server = serverApp.getServer();

MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, client) => {
    if (err) throw err;

    db = client.db();
    server.listen(port);

    signInPageRoute(server, db);
    dashboardPageRoute(server, db);
    sendProfilePicRoute(server, db);
    postUserStatusRoute(server, db);
    removeFriendFromFriendsRoute(server, db);
    updateProfileImageRoute(server, db);
    whitdrawFriendshipRequestRoute(server, db);
    acceptFriendRequestRoute(server, db);
    requestFriendshipRoute(server, db);
    diffUsersProfilePageRoute(server, db);
    userProfilePageRoute(server, db);
    updateProfileRoute(server, db);
    signUpRoute(server, db);
    signInRoute(server, db);
    signOutRoute(server, db);
    fourOfourRoute(server, db);
});