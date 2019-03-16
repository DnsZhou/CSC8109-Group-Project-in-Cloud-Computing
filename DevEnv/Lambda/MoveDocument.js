const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const docClient = new AWS.DynamoDB.DocumentClient({ resgion: 'us-east-2' });
const s3 = new AWS.S3({
    signatureVersion: 'v4'
});
let sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

exports.handler = (event, context, callback) => {
    let bucket = "fes-filestorage"
    let jwtToken = event.jwtToken;
    let decodedJwt = jwt.decode(jwtToken)
    let signature = new Buffer(event.eoo, 'base64')
    let remark = ''
    if (event.state == 'OnGoing') {
        remark = '...'
    } else {
        remark = 'EOO Signature not match with the Original Document'
    }

    s3.copyObject({
        CopySource: bucket + "/userDocs/" + decodedJwt.sub + "/" + event.loc,
        Bucket: bucket,
        Key: 'userDocs/' + decodedJwt.sub + "/" + event.id + '/' + event.loc
    }, (copyErr, copyData) => {
        if (copyErr) {
            console.log(1, copyErr)
            callback(null, false)
        }
        else {
            saveEoo({
                Body: signature,
                Bucket: bucket,
                Key: 'userDocs/' + decodedJwt.sub + "/" + event.id + '/signatureSender'
            }).then((eooData) => {

                changeLoc({
                    TableName: 'FesTransaction',
                    Key: {
                        "transactionId": event.id,
                    },
                    UpdateExpression: "set documentUri = :loc, transactionState = :state, updateTime= :ut, remark= :r",
                    ExpressionAttributeValues: {
                        ":loc": event.loc,
                        ":state": event.state,
                        ":ut": new Date().toUTCString(),
                        ':r': remark
                    },
                    ReturnValues: "UPDATED_NEW"
                }).then((changeData) => {

                    deleteOld({
                        Bucket: bucket,
                        Key: 'userDocs/' + decodedJwt.sub + "/" + event.loc
                    }).then((deleteData) => {
                        if (event.state === "OnGoing") {
                            moveToSQS()
                        }
                    }).catch((deleteErr) => {
                        console.log(4, deleteErr)
                        callback(null, false)
                    })
                    // callback(null, true)

                }).catch((changeErr) => {
                    console.log(2, changeErr)
                    callback(null, false)
                })

            }).catch((eooErr) => {
                console.log(3, eooErr)
                callback(null, false)
            })
        }
    })

    const saveEoo = (params) =>
        new Promise((resolve, reject) => {
            s3.putObject(params, (err, data) => {
                err ? reject(err) : resolve(data);
            });
        });

    const changeLoc = (params) =>
        new Promise((resolve, reject) => {
            docClient.update(params, (err, data) => {
                err ? reject(err) : resolve(data);
            });
        });

    const deleteOld = (params) =>
        new Promise((resolve, reject) => {
            s3.deleteObject(params, (err, data) => {
                err ? reject(err) : resolve(data);
            });
        });

    function moveToSQS() {
        var params = {
            DelaySeconds: 0,
            MessageAttributes: {
                "transaction_id": {
                    DataType: "String",
                    StringValue: event.id
                },
                "signature_location": {
                    DataType: "String",
                    StringValue: "userDocs/" + decodedJwt.sub + "/" + event.id + "/" + "signatureSender"
                },
            },
            MessageBody: "Hi",
            QueueUrl: "https://sqs.eu-west-2.amazonaws.com/663486236311/queue-cloud"
        };

        sqs.sendMessage(params, function (err, data) {
            if (err) {
                callback(err, err)
            }
            else {
                const response = {
                    statusCode: 200,
                    "headers": {
                        "my_header": "my_value",
                        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                    },
                    body: JSON.stringify(true),
                };
                callback(null, response)
            }
        });
    }
};
