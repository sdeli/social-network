var http = require('http');
var serverFn = require('./test2.js');
console.log(serverFn);
http.createServer((req, res) => {
    serverFn();
}).listen(3000);
