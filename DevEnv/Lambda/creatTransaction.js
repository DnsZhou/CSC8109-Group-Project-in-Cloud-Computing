const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const docClient = new AWS.DynamoDB.DocumentClient({ resgion: 'us-east-2' });
const s3 = new AWS.S3({
    signatureVersion: 'v4'
});

exports.handler = function (event, context, callback) {
    // let req = JSON.parse(event.body)
    let jwtToken = event.jwtToken;
    let decodedJwt = jwt.decode(jwtToken)
    let loc = "filestores3/userDocs/" + decodedJwt.sub + "/" + event.loc
    let now = new Date().toUTCString()

    let params = {
        Item: {
            transactionId: event.id,
            sender: decodedJwt.email,
            reciever: event.to,
            documentUri: event.loc,
            transactionState: event.state,
            createTime: now,
            updateTime: now
        },

        TableName: 'FesTransaction'
    };

    docClient.put(params, function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            console.log(data)
            let response = {
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                },
                "body": JSON.stringify({ 'data': data }),
                "isBase64Encoded": true
            };
            callback(null, response)
            // callback(null,data)
        }
    });

};