const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

exports.handler = function (event, context, callback) {


    let jwtToken = JSON.parse(event.jwt);

    let decodedJwt = jwt.decode(jwtToken)

    let fromEmail = decodedJwt.email;


    // let fromEmail = 'b8027518@ncl.ac.uk';

    let params = {
        TableName: 'FesTransaction'
    };

    docClient.scan(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err, null);
        } else {

            let response = {
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                },
                "body": JSON.stringify(processData(fromEmail, data)),
                "isBase64Encoded": true
            };

            callback(null, response);
        }
    });
};

const processData = (fromEmail, data) => {
    console.log(fromEmail);
    data = data.Items;
    let res = [];
    for (var i = 0; i < data.length; i++) {
        userData = {}
        if (fromEmail == data[i].sender) {
            userData.transactionId = data[i].transactionId,
                userData.reciever = data[i].reciever,
                userData.sender = data[i].sender,
                userData.status = data[i].transactionState,
                // userData.state = data[i].state,
                userData.createTime = data[i].createTime,
                userData.updateTime = data[i].updateTime,
                res.push(userData);
        } else {
            // return 'data error';
        }
    }
    return res;
};