function signUpRoute(server, db) {
    server.route('/sign-up', {method : 'POST'}, (req, res) => {
        let userDataJson = '';

        req.on('data', (chunk) => {
            userDataJson += chunk;
        });

        req.on('end', () => {
            userDataObj = JSON.parse(userDataJson);

            checkIfUserExists(db, userDataObj)
                .then(ifUserExist => {
                    if (ifUserExist) {
                        sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', 'there has been a same user', res);
                    } else {
                        insertOneUser(db, userDataObj)
                            .then(() => {
                                sendStatusMessageToFrontEnd(200, 'credentials are ok', 'text/plain', 'credentials are ok', res);
                            }).catch(e => {
                                console.log(e);
                                let msg = `there has been an error: ${e}`;
                                sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', msg, res);
                            });
                    }
                }).catch(e => {
                    console.log(e);
                    let msg = `there has been an error: ${e}`;
                    sendStatusMessageToFrontEnd(200, 'OK', 'text/plain', msg, res);
                });
        });
    });

    function checkIfUserExists(db, userDataObj) {
        return new Promise((resolve, reject) => {
            db.collection('users')
                .findOne(userDataObj).then(result => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }).catch(e => {
                    console.log(e);
                    reject('there has been an error with the db')
                });
        });

    }

    function insertOneUser(db, userDataObj) {
        return new Promise((resolve, reject) => {
            db.collection('users')
                .insertOne(userDataObj).then(result => {
                    resolve()
                }).catch(e => {
                    console.log(e);
                    reject(e);
                });
        });
    }

    function sendStatusMessageToFrontEnd(statusCode, StatusMessage, ContentType, endMsg, res){
        res.writeHead(statusCode, StatusMessage, {contentType : ContentType});
        res.end(endMsg);
    }
}

module.exports = signUpRoute;