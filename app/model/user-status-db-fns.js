/*
 * Title: 
 * Description: 
 * Author: Sandor Deli
 * logic: 
 *
 userDocFields:
 name : {type : string},
 email : {type : string},
 pass : {type : string},
 memberId : {type : string},
 profilePic : `${this.memberId}`-String` 
 friends : [{member_id : String, friend_name : String, profile_pic: String}],
 friendRequest : [{member_id : String, friend_name : String, profile_pic: String}],
 user_profile :  

 UserProfileDocFileds:
 localtion : {type : String},
 description : {type : String},
 interests : {type : String},
 profile_pic : {type : String, def_value : 'default.png'} 
 */

 /*
    userStatusSchema = {
        usrEmail : String,
        usrStatus : String,
        usrName : String,
        statusDate : Date
    }
 */

function insertOneUserStatusToDb(db, userDataObj) {
    return new Promise((resolve, reject) => {
        db.collection('users_status')
            .insertOne(userDataObj).then(userDataObj => {
                resolve(userDataObj.ops[0])
            }).catch(e => {
                console.log(e);
                reject(e);
            });
    });
}

function getDate() {
    let today = new Date();
    //let hh = today.getHours()
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 

    let today = mm + ' ' + dd + ' ' + yyyy;
    return today
}

module.exports = {
    insertOneUserToDb,
    getDate
}