const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const docClient = new AWS.DynamoDB.DocumentClient({ resgion: 'us-east-2' });

exports.handler = (event, context, callback) => {
    let jwtToken = event.jwt_reciever;
    let decodedJwt = jwt.decode(jwtToken)
    let recieverEmail = decodedJwt.email
    let transactionId = event.transaction_id
    console.log(transactionId)

    let params = {
        TableName: 'FesTransaction',
        Key: {
            transactionId: transactionId
        }
    }
    docClient.get(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(null, err);
        } else {
            console.log(data);
            if (data.Item.reciever == recieverEmail) {
                callback(null, true);
            } else {
                callback(null, false);
            }

        }
    });

    //   let response = {
    //         "statusCode": 200,
    //         "headers": {
    //             "my_header": "my_value",
    //             "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    //             "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    //         },
    //         "body": JSON.stringify("SUCCESS INSIDE"),        
    //     };

};
