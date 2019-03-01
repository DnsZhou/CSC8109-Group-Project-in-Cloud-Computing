var WildRydes = window.WildRydes || {};
var jwtToken = null;

window.onload = function () {
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

function logOut() {
    localStorage.clear();
    alert("User logout, Redirect to login page")
    window.location.href = 'login.html';
}