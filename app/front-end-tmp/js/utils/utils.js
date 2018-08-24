function setCookie(cookieName, cookiesValue, expirationDays, path) {
    var dateObj = new Date();
    dateObj.setTime(dateObj.getTime() + (expirationDays*24*60*60*1000));
    var expires = "expires="+ dateObj.toUTCString();
    document.cookie = cookieName + "=" + cookiesValue + ";" + expires + ";path=" + path;
}

function destroyCookie(cookieName, cookiesValue, path) {
    var dateObj = new Date();
    document.cookie = `${cookieName}=${cookiesValue}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function returnObjFromJson(str) {
    try {
        var obj = JSON.parse(str);
    } catch (e) {
        return false;
    }

    return obj;
}

function clearFormFields(formFieldsArr) {
    formFieldsArr.forEach(formField => {
        formField.value = '';
    });
}

function checkIfHasSignedInCookie() {
    var ifHasSignedInCookie = document.cookie.indexOf("user_auth_session") >= 0;

    if (ifHasSignedInCookie) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    setCookie,
    returnObjFromJson,
    clearFormFields,
    destroyCookie,
    clearFormFields,
    checkIfHasSignedInCookie
}