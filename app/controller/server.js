const {MongoClient} = require('mongodb');
const ejs = require('ejs');

const serverApp = require('../../server-app/server-singleton.js');
const getRoutes = require('./routes/routes.js')
const postRoutes = require('./routes/post-routes.js')
const port = 3000;

const dbName = 'social-network';
const dbUrl = `mongodb://localhost:27017/${dbName}`;
let db;

var server = serverApp.getServer();

MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, client) => {
    if (err) throw err;

    db = client.db();
    server.listen(port);
    
    getRoutes(server, db);
    postRoutes(server, db);
});