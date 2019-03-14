const AWS = require('aws-sdk')
const jwt = require('jsonwebtoken');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

exports.handler = (event, context, callback) => {
    console.log(event);
    var jwtToken = JSON.parse(event.body).jwtToken;
    var decodedJwt = jwt.decode(jwtToken);

    let params = {
        TableName: "FesUser",
        ProjectionExpression: "email, fullName",
        FilterExpression: 'email <> :email',
        ExpressionAttributeValues: { ":email": decodedJwt.email }
    }

    docClient.scan(params, function (err, data) {
        if (err) {
            console.log("error: ", err)
            let response = {
                "statusCode": 500,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                },
                "body": JSON.stringify("Error while reading User from DB"),
            };
            callback(null, response);
        } else {
            let response = {
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                },
                "body": JSON.stringify(data.Items)
            }
            callback(null, response);
        }
    });

};