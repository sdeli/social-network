serverObject = require('./server/server-object.js')

module.exports = (function(){

    let instanceOfServerApp;

    // initalizing the motor behind the user interface
    function init(){
        // object creation here
        return serverObject();
    }

    return {
        getServer : function(){
            // lazy loading the object
            if(!instanceOfServerApp){
                instanceOfServerApp = init();
                return instanceOfServerApp
            } else return instanceOfServerApp;
        }
    }
    
}());   
