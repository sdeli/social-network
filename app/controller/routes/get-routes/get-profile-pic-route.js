let fs = require('fs');

function sendProfilePicRoute(server, db) {
    server.route('/users_profile_pic/:profile_pic_name', (req, res) => {
        res.writeHead(200, 'OK', {contentType : 'image/png'});
        
        let profilePicName = res.pathVariables.profile_pic_name;
        let profilePicPath = `../front-end-tmp/img/${profilePicName}`;
        let ifPicExist = fs.existsSync(profilePicPath);

        if (ifPicExist) {
            sendProfilePicToFrontEnd(res, profilePicPath);
        } else {
            let defaultProfilePicPath = `../front-end-tmp/img/default_profile.png`;
            sendProfilePicToFrontEnd(res, defaultProfilePicPath)
        }
    });

    function sendProfilePicToFrontEnd(res, profilePicPath) {
        fs.readFile(profilePicPath, function (err, pic) {
            if (err) throw err;
            res.writeHead(200, 'OK', {contentType : 'image/png'});
            res.end(pic);
        });
    }
}

module.exports = sendProfilePicRoute;