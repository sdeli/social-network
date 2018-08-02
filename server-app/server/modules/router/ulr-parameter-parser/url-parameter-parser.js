/*
 * Title: url parameter parser
 * Description: extracts url paramters and compares the Url path with the route
 *     - arguments of urlParameterParser: urlPath, route, callback
 *     - a path-parameter: each string after a / with a :
 *     - At first it checks if function has already been called succesfull/if once the route and urlpath has matched. If yes function returns false
 *     - It checks for edge case, if curr is an edge case calls callback and returns   
 *     - It checks if url and route are identical, if not returns false
 *     to be identical: 
 *             - number of path-units (path-unit => a string after a / sign until the next one or in case *             of 
 *             - last path-unit - after the last / sign - until the end of the path) should be identical
 *             - if there are parameters, then all path-units before and after the parameter should be 
 *              identical (in the urlpath and route)
 *             - if there are no url params then all path-untis should be identical
 *     - if route and Url path are identical, callbackFn will be called, with the path-parameters passed 
 *                      
 * Author: Sandor Deli
 * logic: 
 */

function urlParameterParser(reqUrlPath, route){
    isEdgeCase = checkEdgeCases(reqUrlPath, route)
    if (isEdgeCase) {
        return {};
    }

    let reqUrlPathArr = removeEmptyIndexesInArr(reqUrlPath.split('/'));
    let routeArr = removeEmptyIndexesInArr(route.split('/'));
    let ifPathUnitsLengthMatch = reqUrlPathArr.length === routeArr.length;
    if (!ifPathUnitsLengthMatch) return false;

    let pathVarIndexes = getIndexesOfPathVars(routeArr);
    let doRouteAndReqUrlPathMatch = checkIfRouteAndReqUrlPathMatch(routeArr, pathVarIndexes, reqUrlPathArr);

    if (doRouteAndReqUrlPathMatch) {
        let pathVarsObj = getPathVariables(routeArr, pathVarIndexes, reqUrlPathArr)
        return pathVarsObj;
    } else {
        return false;
    }
};

function checkEdgeCases(reqUrlPath, route) {
    if (reqUrlPath === '*') {
        return true;
    } else if ((reqUrlPath === '/' || reqUrlPath === '') && route === '/') {
        return true;
    } else {
        return false;
    }
}

function checkIfRouteAndReqUrlPathMatch(routeArr, pathVarIndexes, reqUrlPathArr) {
    for (let i = 0; i < routeArr.length; i++) {
        if (pathVarIndexes.indexOf(i) > -1) continue;

        if (routeArr[i] !== reqUrlPathArr[i]) {
            return false;
        } else {
            // do nothing just check the next item
            // if all item are identical loop finishes and function returns true
        }

        return true;
    };
}

function getIndexesOfPathVars(routeArr) {
    return routeArr.reduce((pathVarIndexes, currPathUnit, currIndex) => {
        if (currPathUnit.indexOf(':') === 0) {
            return [...pathVarIndexes, currIndex]
        }

        return pathVarIndexes;
    }, []);
}

function getPathVariables(routeArr, pathVarIndexes, reqUrlPathArr) {
    let pathVarsObj = {};

    pathVarIndexes.forEach((pathVarIndex) => {
        // in the route Path var is highlighted as :variable so first index need to be extracted
        let pathVarName = routeArr[pathVarIndex].slice(1);
        pathVarsObj[pathVarName] = reqUrlPathArr[pathVarIndex];
    });

    return pathVarsObj;
}

function removeEmptyIndexesInArr(arr) {
    return arr.filter(currItem => currItem !== '');
}

module.exports = {
    urlParameterParser,
    checkEdgeCases,
    checkIfRouteAndReqUrlPathMatch,
    getIndexesOfPathVars,
    getPathVariables,
    removeEmptyIndexesInArr,
}