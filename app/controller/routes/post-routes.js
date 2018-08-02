function postRouts(server, db) {
    server.route('/sign-up', {method : 'POST'}, (req, res) => {
        let userDataJson = '';
        console.log();
        req.on('data', (chunk) => {
            userDataJson += chunk;
        });

        req.on('end', () => {
            userDataJson = JSON.parse(userDataJson);

            db.collection('users')
                .insertOne(userDataJson).then(result => {
                    res.writeHead(204, 'OK', {contentType : 'text/plain'});
                    res.end();
                }).catch(e => {
                    console.log(e);
                    res.writeHead(200, 'OK', {contentType : 'text/plain'})
                    res.end('you suckd');
                });
        });
    });
}

module.exports = postRouts;