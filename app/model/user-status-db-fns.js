/*
 * Title: 
 * Description: 
 * Author: Sandor Deli
 * logic: 
 * 
userStatusSchema = {
    "usrName" : "Sandor Deli", 
    "password" : "asdd", 
    "email" : "bgfkszmsdeli@gmail.com", 
    "profilePicName" : "profile-img-hY7D1i.png", 
    "memberId" : "Sandor deli-pzZu^y", 
    "location" : "Miami", 
    "description" : "I am a fan boy of coding", 
    "interests" : "coding"
    "friends" : [ObjectId]
    "friendsRequests" : [ObjectId]
}
 */

function insertStatusDetailsToDb(db, statusDetailsObj) {
    return new Promise((resolve, reject) => {
        db.collection('users_status')
        .insertOne(statusDetailsObj)
        .then(statusDetailsObj => {
            resolve(statusDetailsObj.ops[0])
        }).catch(e => {
            console.log(e);
            reject(e);
        });
    });
}

function getUserStatusesFromDb(db, query) {
    return new Promise((resolve, reject) => {
        db.collection('users_status')
        .find(query)
        .toArray()
        .then(result => {
            if (result) {
                resolve(result);
            } else {
                resolve(false);
            }
        }).catch(e => {
            console.log(e);
            reject('there has been an error with the db')
        });
    });
}

function updateAllUserStatusesInDb(db, findQuery, updateQuery, updateOpts) {
    updateOpts = updateOpts || {returnOriginal : false}
    return new Promise((resolve, reject) => {
        db.collection('users_status')
        .updateMany(findQuery, updateQuery, updateOpts)
        .then((updates) => {
            resolve(updates);
        }).catch(e => {
            reject(e);
        })
    });
}

module.exports = {
    insertStatusDetailsToDb,
    getUserStatusesFromDb,
    updateAllUserStatusesInDb
}