const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const docClient = new AWS.DynamoDB.DocumentClient({ resgion: 'us-east-2' });
const s3 = new AWS.S3({
    signatureVersion: 'v4'
});
let sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

exports.handler = (event, context, callback) => {
    let json_parameters = event
    let transaction_id = json_parameters.transaction_id
    let eor_result = json_parameters.eor_result
    let jwt_token = json_parameters.jwt

    var checkparams = {
        TableName: 'FesTransaction',
        Key: {
            transactionId: transaction_id
        }
    };

    docClient.get(checkparams, function (err, data) {
        if (err) {
            const response = {
                statusCode: 505,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                },
                body: JSON.stringify("Internal Server Error Please Try Again"),
            };
            callback(err, response)
        }
        else {
            console.log(data);
            if (data.Item.transactionState == "OnGoing") {
                if (eor_result === false) {
                    setState(transaction_id, 'Aborted', 'EOR Signature not match with the EOO Signature')
                }
                else {
                    moveToSQS(jwt_token, transaction_id)
                }
            } else {
                const response = {
                    statusCode: 510,
                    "headers": {
                        "my_header": "my_value",
                        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                    },
                    body: JSON.stringify("Transaction already aborted"),
                };
                callback(err, response)
            }
        }
    });



    function moveToSQS(jwt_token, transaction_id) {
        var params = {
            DelaySeconds: 0,
            MessageAttributes: {
                "transaction_id": {
                    DataType: "String",
                    StringValue: transaction_id
                },
                "jwt": {
                    DataType: "String",
                    StringValue: jwt_token
                },
            },
            MessageBody: "Hi",
            QueueUrl: "https://sqs.eu-west-2.amazonaws.com/663486236311/Step4-5Queue"
        };

        sqs.sendMessage(params, function (err, data) {
            if (err) {
                const response = {
                    statusCode: 505,
                    "headers": {
                        "my_header": "my_value",
                        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                    },
                    body: JSON.stringify("There has been an internal error try again"),
                };
                callback(err, response)
            }
            else {
                setState(transaction_id, 'Resolved', '...')
            }
        });
    }

    function setState(transaction_id, state, remark) {
        var params = {
            TableName: "FesTransaction",
            Key: {
                "transactionId": transaction_id
            },
            UpdateExpression: "set transactionState= :ts, updateTime= :ut, remark= :r",
            ExpressionAttributeValues: {
                ":ts": state,
                ":ut": new Date().toUTCString(),
                ":r": remark
            },
            ReturnValues: "UPDATED_NEW"
        };

        docClient.update(params, function (err, data) {
            if (err) {
                const response = {
                    statusCode: 500,
                    "headers": {
                        "my_header": "my_value",
                        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                    },
                    body: JSON.stringify("Internal Server Error Please Try Again"),
                };
                callback(err, response)
            }
            else {
                const response = {
                    statusCode: 200,
                    "headers": {
                        "my_header": "my_value",
                        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                    },
                    body: JSON.stringify(data),
                };
                callback(true, response);
            }
        });
    }

}