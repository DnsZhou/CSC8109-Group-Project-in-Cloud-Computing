const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
var s3 = new AWS.S3();

exports.handler = (event, context, callback) => {

    console.log(event.Records[0].messageAttributes)
    console.log("Signature Location: " + event.Records[0].messageAttributes.signature_location.stringValue)
    let signature_location = event.Records[0].messageAttributes.signature_location.stringValue
    let transactionId = event.Records[0].messageAttributes.transaction_id.stringValue
    // var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    queryDatabase(transactionId)

    function queryDatabase(transactionId) {
        let params = {
            TableName: "FesTransaction",
            Key: {
                "transactionId": transactionId
            }
        }

        docClient.get(params, (err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log(data.Item.reciever)
                retrieveCognitoSub(data.Item.reciever)
            }
        })
    }

    function retrieveCognitoSub(reciever) {
        var params = {
            UserPoolId: 'eu-west-2_i26ambKSW',
            /* required */
            AttributesToGet: [
                'sub',
            ],
            Filter: "email = \"" + reciever + "\"",
            Limit: 10,

        };
        cognitoidentityserviceprovider.listUsers(params, function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
                console.log(data.Users[0].Attributes[0].Value)
                transferSignature(data.Users[0].Attributes[0].Value)

            }
        });
    }

    function transferSignature(recieverSub) {
        let srcBucket = "fes-filestorage"
        let destBucket = srcBucket
        let sourceObject = "signatureSender"
        s3.copyObject({
            CopySource: srcBucket + "/" + signature_location,
            Bucket: destBucket + "/" + "userDocs/" + recieverSub + "/" + transactionId,
            Key: sourceObject
        }, (copyErr, copyData) => {
            if (copyErr) {

                console.log(copyErr)
            }
            else {
                console.log(copyData)
            }
        });
    }
}
