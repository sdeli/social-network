const {MongoClient} = require('mongodb');
const ejs = require('ejs');

const serverApp = require('../../server-app/server-singleton.js');
const signInPageRoute = require('./routes/get-routes/sing-in-page-route.js');
const dashboardPageRoute = require('./routes/get-routes/user-dashboard-route.js');
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
    signUpRoute(server, db);
    signInRoute(server, db);
    signOutRoute(server, db);
    fourOfourRoute(server, db);
});