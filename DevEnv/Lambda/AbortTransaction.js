const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
const decoded = require('jwt-decode')

exports.handler = (event, context, callback) => {

    let transactionId = event.id
    let jwt = decoded(event.jwt)
    let params = {
        TableName: "FesTransaction",

        Key: {
            "transactionId": transactionId
        }
    }

    docClient.get(params, (err, data) => {
        if (err) {
            const response = {
                statusCode: 400,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                },
                body: JSON.stringify(err),
            };
            callback(null, response);
        }
        else {
            checkIfAbort(data)
        }
    });


    //Implement email to check if sender


    function checkIfAbort(data) {
        if (data.Item.transactionState === "OnGoing" && data.Item.reciever === jwt.email) {
            var params = {
                TableName: "FesTransaction",
                Key: {
                    "transactionId": transactionId
                },
                UpdateExpression: "set transactionState= :ts, remark= :r",
                ExpressionAttributeValues: {
                    ":ts": "Aborted",
                    ":r": "Aborted by the reciever"
                },
                ReturnValues: "UPDATED_NEW"
            };

            docClient.update(params, function (err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                }
                else {
                    const response = {
                        statusCode: 200,
                        "headers": {
                            "my_header": "my_value",
                            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                        },
                        body: JSON.stringify("abort success"),
                    };
                    callback(null, response);
                }
            });

        }

        else if (data.Item.transactionState === "OnGoing" && data.Item.sender === jwt.email) {
            var params = {
                TableName: "FesTransaction",
                Key: {
                    "transactionId": transactionId
                },
                UpdateExpression: "set transactionState= :ts, remark= :r",
                ExpressionAttributeValues: {
                    ":ts": "Aborted",
                    ":r": "Aborted by the sender"
                },
                ReturnValues: "UPDATED_NEW"
            };

            docClient.update(params, function (err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                }
                else {
                    const response = {
                        statusCode: 200,
                        "headers": {
                            "my_header": "my_value",
                            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                        },
                        body: JSON.stringify("abort success"),
                    };
                    callback(null, response);
                }
            });

        }

        else {
            const response = {
                statusCode: 200,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                },
                body: JSON.stringify("Transaction is Already Aborted/Resolved or You are not authorized to do this action"),
            };
            callback(null, response);
        }
    }
}
