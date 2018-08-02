const router = require('./modules/router/router.js');
const listen = require('./modules/listen/listen.js');

function createServerObj() {
    return {
        listen,
        routeHandler : {
            routesArr : [],
            router,
            ejsGlobals : {}
        },
        route : function defineRoutes(path, opts, callBack) {
            if (arguments.length === 2) {
                var callBack = opts;

                this.routeHandler.routesArr.push({
                    path,
                    callBack
                });
            } else {
                this.routeHandler.routesArr.push({
                    path,
                    callBack,
                    opts
                });
            }
        },
        set ejsGlobals(newGlobals) {
            let ejsGlobals = this.routeHandler.ejsGlobals;

            for (key in newGlobals) {
                ejsGlobals[key] = newGlobals[key];
            }
        }
    }
}

module.exports = createServerObj;