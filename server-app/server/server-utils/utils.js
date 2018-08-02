const fs = require('fs');
const ejs = require('ejs');

function trimmPath(path){
    if (path !== '' && path !== '/') {
        var trimmedPath = path.replace(/^\/+|\/+$/g, '');
        return trimmedPath;
    } else if (path === ''){
        return '/';
    } else if(path === '/'){
        return path;
    }
}


function getFilesFromFolder(dirPath) {
    if (!dirPath) return false;
    var dirPathContentArr = fs.readdirSync(dirPath);

    dirPathContentArr.forEach((fileName, i) => {
        dirPathContentArr[i] = `${dirPath}/${fileName}`;
    }); 

    return dirPathContentArr;
}

function sendTemplateByEjs(templatePath) {
    ejs.renderFile(templatePath, (err, html) => {
        if (err) {
            console.log(err);   
            error = err;
        } else {
            res.write(html);
            res.end();
        }
    })
}

module.exports = {
    trimmPath,
    getFilesFromFolder,
    sendTemplateByEjs
}
