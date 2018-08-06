/*var http = require('http');
http.createServer(function (req, res) {
  redirectToOtherPage(res, 'http://localhost:3000/dashboard')
}).listen(8080)

function redirectToOtherPage(res, otherPageUrl) {
    res.writeHead(200, 'OK', {
        'location' : otherPageUrl
    });

    res.end();
}d*/

function majom(call) {
    call();
}

async function geza() {
    console.log('fasz');
    var x = await wait();
    console.log('a promise:' + x);
    
}

function wait() {
    return new Promise(resolve => {
        setTimeout(function() {
            resolve('1')
        }, 3000)
    });
}

majom(call);