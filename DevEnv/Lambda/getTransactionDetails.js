const AWS = require('aws-sdk')
const s3 = new AWS.S3();
const jwt = require('jsonwebtoken');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });
const HEADERS = {
    "my_header": "my_value",
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
}

exports.handler = (event, context, callback) => {
    console.log(event);
    var jwtToken = JSON.parse(event.body).jwtToken;
    var currentTransactionId = JSON.parse(event.body).transactionId;
    var decodedJwt = jwt.decode(jwtToken);
    var currentUserSub = decodedJwt.sub;
    var currentS3Param = { Bucket: 'fes-filestorage', Key: 'userDocs/' + currentUserSub + '/' + currentTransactionId + '/' }
    var currentS3ParamEOO = { Bucket: 'fes-filestorage', Key: 'userDocs/' + currentUserSub + '/' + currentTransactionId + '/' }
    var currentS3ParamEOR = { Bucket: 'fes-filestorage', Key: 'userDocs/' + currentUserSub + '/' + currentTransactionId + '/' }

    var currentEor = null;
    var currentEoo = null;

    let params = {
        TableName: "FesTransaction",
        ProjectionExpression: "transactionId, sender, reciever, transactionState, createTime, updateTime, remark, documentUri",
        FilterExpression: 'transactionId = :transactionId',
        ExpressionAttributeValues: { ":transactionId": currentTransactionId }
    }
    getSignatureFromS3("eoo", currentUserSub, currentTransactionId, currentS3Param, currentS3ParamEOO, currentS3ParamEOR).then(function (eoo) {
        getSignatureFromS3("eor", currentUserSub, currentTransactionId, currentS3Param, currentS3ParamEOO, currentS3ParamEOR).then(function (eor) {
            currentEoo = eoo;
            currentEor = eor;
            console.log("currentEoo: " + currentEoo)
            console.log("currentEor: " + currentEor)

            docClient.scan(params, function (err, data) {
                if (err) {
                    console.log("error: ", err)
                    let response = {
                        "statusCode": 500,
                        "headers": HEADERS,
                        "body": JSON.stringify("Error while reading User from DB"),
                    };
                    callback(null, response);
                } else {
                    if (!data || !data.Items || data.Items.length == 0) {
                        console.log("Error: Transaction -- " + currentTransactionId + "not found in system.")
                        let response = {
                            "statusCode": 404,
                            "headers": HEADERS,
                            "body": JSON.stringify("Error: Transaction -- " + currentTransactionId + "not found in system."),
                        };
                        callback(null, response);
                    } else {
                        var transaction = data.Items[0];
                        console.log("scan executed successfully")
                        if (decodedJwt.email == transaction.sender) {
                            console.log("Execute sender")
                            transaction.eoo = currentEoo;
                            if (transaction.transactionState == "Resolved") {
                                transaction.eor = currentEor;
                            }
                            let response = {
                                "statusCode": 200,
                                "headers": HEADERS,
                                "body": JSON.stringify(transaction)
                            }
                            callback(null, response);
                        } else if (decodedJwt.email == transaction.reciever) {
                            if (transaction.transactionState == "Resolved") {
                                console.log("Execute reciever resolved")
                                transaction.eoo = currentEoo;
                                transaction.eor = currentEor;
                                let response = {
                                    "statusCode": 200,
                                    "headers": HEADERS,
                                    "body": JSON.stringify(transaction)
                                };
                                callback(null, response);
                            } else if (transaction.transactionState == "OnGoing") {
                                console.log("Execute reciever onGoing")
                                var trimedTransaction = {
                                    "transactionId": transaction.transactionId,
                                    "sender": transaction.sender,
                                    "reciever": transaction.reciever,
                                    "transactionState": transaction.transactionState,
                                    "createTime": transaction.createTime,
                                    "updateTime": transaction.updateTime,
                                    "remark": transaction.remark
                                };
                                trimedTransaction.eoo = currentEoo;
                                let response = {
                                    "statusCode": 200,
                                    "headers": HEADERS,
                                    "body": JSON.stringify(trimedTransaction)
                                };
                                console.log(response);
                                callback(null, response);
                            } else if (transaction.transactionState == "Aborted") {
                                console.log("Execute reciever aborted")
                                var trimedTransaction = {
                                    "transactionId": transaction.transactionId,
                                    "sender": transaction.sender,
                                    "reciever": transaction.reciever,
                                    "transactionState": transaction.transactionState,
                                    "createTime": transaction.createTime,
                                    "updateTime": transaction.updateTime,
                                    "remark": transaction.remark
                                };
                                let response = {
                                    "statusCode": 200,
                                    "headers": HEADERS,
                                    "body": JSON.stringify(trimedTransaction)
                                };
                                callback(null, response);
                            } else {
                                console.log("Error: Current transaction -- " + currentTransactionId + "do not have a validated transactionState.")
                                let response = {
                                    "statusCode": 403,
                                    "headers": HEADERS,
                                    "body": JSON.stringify("Error: Current transaction -- " + currentTransactionId + "do not have a validated transactionState."),
                                };
                                callback(null, response);
                            }
                        } else {
                            console.log("Invalidate Request: Current user -- " + decodedJwt.email + " is not authorized to view this transaction -- " + currentTransactionId);
                            let response = {
                                "statusCode": 403,
                                "headers": HEADERS,
                                "body": JSON.stringify("Invalidate Request: Current user -- " + decodedJwt.email + " is not authorized to view this transaction -- " + currentTransactionId),
                            };
                            callback(null, response);
                        }
                    }
                }
            });

        })
    });


    function getSignatureFromS3(signatureFlag, sub, transactionId, s3Param, s3ParamEOO, s3ParamEOR) {
        return new Promise(function (resolve, reject) {
            switch (signatureFlag) {
                case "eoo": s3ParamEOO.Key += "signatureSender"; break;
                case "eor": s3ParamEOR.Key += "signatureReciever"; break;
            }
            if (signatureFlag === "eoo") {
                s3.getObject(s3ParamEOO, function (err, dataSignature) {
                    console.log(s3Param.Key)
                    if (err) {
                        resolve(null);
                    }
                    else {
                        console.log(dataSignature.Body);
                        resolve(dataSignature.Body.toString('base64'));
                    }
                })
            }
            if (signatureFlag === "eor") {
                s3.getObject(s3ParamEOR, function (err, dataSignature) {
                    console.log(s3Param.Key)
                    if (err) {
                        resolve(null);
                    }
                    else {
                        console.log(dataSignature.Body);
                        resolve(dataSignature.Body.toString('base64'));
                    }
                })
            }
        });
    }
};