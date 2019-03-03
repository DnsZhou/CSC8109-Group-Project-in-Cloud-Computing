var WildRydes = window.WildRydes || {};
var jwtToken = null;
var apigClient = apigClientFactory.newClient({
    apiKey: 'usObnKVt3F8ULNETbOMp26YAgm3bYOqh1Ahi6cfa'
});

window.onload = function () {
    verifyUserLogin();
    getAllUsers();
    $('#inputGroupFileAddon04').on('click',()=>{
        upload()
    })
}

$(document).ready(function () {

});

function logOut() {
    localStorage.clear();
    alert("User logout, Redirect to login page")
    window.location.href = 'login.html';
}

function verifyUserLogin() {
    var signinUrl = './login.html';

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool;

    if (!(_config.cognito.userPoolId &&
        _config.cognito.userPoolClientId &&
        _config.cognito.region)) {
        $('#noCognitoMessage').show();
        return;
    }

    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    WildRydes.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
    };

    WildRydes.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err || !session.isValid()) {
                    alert("Unauthorized user, Please Login!")
                    window.location.href = 'login.html';
                } else {
                    jwtToken = session.getIdToken().getJwtToken()
                    resolve(jwtToken);
                }
            });
        } else {
            alert("Unauthorized user, Please Login!")
            window.location.href = 'login.html';
        }
    });
}

function getAllUsers() {
    var params = {
        // This is where any modeled request parameters should be added.
        // The key is the parameter name, as it is defined in the API in API Gateway.
        // param1: ''
    };

    var body = {
        jwtToken: jwtToken
    };

    var additionalParams = {
        // If there are any unmodeled query parameters or headers that must be
        //   sent with the request, add them here.
        headers: {},
        queryParams: {}
    };

    apigClient.userGetallusersPost(params, body, additionalParams)
        .then(function (result) {
            // Add success callback code here.
            console.log(result.data)
            result.data.forEach((user)=>{
                console.log(user);
                $("#selectEmail").append("<option value='"+user.email+"'>"+user.fullName+"("+user.email+")</option>")
            })
        }).catch(function (result) {
            // Add error callback code here.
        });
}