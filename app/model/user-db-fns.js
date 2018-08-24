/*
userDocSchiema:
 name : {type : string, mandatory},
 email : {type : string, mandatory},
 pass : {type : string, mandatory},
 memberId : {type : string, mandatory},
 profilePicName : `${this.memberId}`-String`, mandatory
 friends : [{member_id : String, friend_name : String, profile_pic: String}],
 friendRequest : [{member_id : String, friend_name : String, profile_pic: String}],
 localtion : {type : String},
 description : {type : String},
 interests : {type : String},
 profile_pic : {type : String, def_value : 'default.png'} 

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
            .findOne({email : userDataObj.email, password : userDataObj.password}).then(result => {
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

function updateUserInDb(db, findQuery, updateQuery, updateOpts) {
    updateOpts = updateOpts || {returnOriginal : false};
    
    return new Promise((resolve, reject) => {
        db.collection('users')
        .findOneAndUpdate(findQuery, updateQuery, updateOpts)
        .then((updates) => {
            resolve(updates.lastErrorObject.updatedExisting);
        }).catch(e => {
            reject(e);
        })
    });
}

function aggregateUsersDb(db, aggrQuery) {
    return new Promise((resolve, reject) => {
        db.collection('users')
        .aggregate(aggrQuery)
        .toArray()
        .then((docs) => {
            resolve(docs)
        }).catch(e => {
            reject(e);
        })
    })
}

module.exports = {
    checkIfUserExists,
    insertOneUserToDb,
    getUserInfosFromDb,
    updateUserInDb,
    aggregateUsersDb
}