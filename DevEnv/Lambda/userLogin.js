const jwt  = require('jsonwebtoken');

exports.handler = (event, context, callback) => {
    console.log(JSON.parse(event))
    var jwtToken = JSON.parse(event.body).jwtToken;
    var decodedJwt = jwt.decode(jwtToken)
    
    console.log("userLogin executed with decoded JWT: "+JSON.stringify(decodedJwt.sub)) //get the sub from jwt
    // TODO implement
   let response = {
        "statusCode": 200,
        "headers": {
            "my_header": "my_value",
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        "body": JSON.stringify("SUCCESS INSIDE"),        
};
    callback(null, response);
};
