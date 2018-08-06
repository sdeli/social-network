/*
userDocSchiema:
 name : {type : string, mandatory},
 email : {type : string, mandatory},
 pass : {type : string, mandatory},
 memberId : {type : string, mandatory},
 profilePicName : `${this.memberId}`-String`, mandatory
 friends : [{member_id : String, friend_name : String, profile_pic: String}],
 friendRequest : [{member_id : String, friend_name : String, profile_pic: String}],
 user_profile :  

*/

function getUserInfosFromDb(db, query) {
    return new Promise((resolve, reject) => {
        db.collection('users')
            .findOne(query).then(result => {
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

function checkIfUserExists(db, userDataObj) {
    return new Promise((resolve, reject) => {
        db.collection('users')
            .findOne({email : userDataObj.email}).then(result => {
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

/*
userDocSchema = {
    usrName,
    password,
    email,
    profilePicName
}
*/
function insertOneUserToDb(db, userDataObj) {
    return new Promise((resolve, reject) => {
        db.collection('users')
            .insertOne(userDataObj).then(userDataObj => {
                resolve(userDataObj.ops[0])
            }).catch(e => {
                console.log(e);
                reject(e);
            });
    });
}

module.exports = {
    checkIfUserExists,
    insertOneUserToDb,
    getUserInfosFromDb
}