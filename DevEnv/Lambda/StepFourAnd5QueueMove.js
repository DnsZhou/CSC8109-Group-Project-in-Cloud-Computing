const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
AWS.config.update({ region: process.env.AWS_REGION });
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
var s3 = new AWS.S3();
let decoded = require('jwt-decode')
exports.handler = (event, context, callback) => {
    //Message Attributes
    //******************
    //RecieverJWT
    //TransactionID

    let jwt_reciever = decoded(event.Records[0].messageAttributes.jwt.stringValue)
    let jwt = "eyJraWQiOiJZbDRZbWFoSnBZK0NLSTJlYkNOOHBReDZnVXJGbVlSTjlSU1hiSHMrQW00PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4MDg0NDUxOS0wM2Y2LTQ3YWUtOGJkMS0xZWVhMTkxOTIxNzciLCJhdWQiOiI3dWwwYnFpZGhocThqbTE1Mm82Z2prcWk1ZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6IjNlMzBmMzMzLTQxYTctMTFlOS1iZWZiLTMzNGQ4OTFmMGJhNCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTUyMDUyMjE3LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl9pMjZhbWJLU1ciLCJuYW1lIjoiQ2hyaXN0b3BoZXIiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2hyaXN5Lmxpa2VzLnBpZUBnb29nbGVtYWlsLmNvbSIsImV4cCI6MTU1MjA1NTgxNywiaWF0IjoxNTUyMDUyMjE3LCJlbWFpbCI6ImNocmlzeS5saWtlcy5waWVAZ29vZ2xlbWFpbC5jb20ifQ.XdwSof2PrV2apXWNHpvmPaWkAw8ms_m2MIwQn25eOaxkWv9z4_OkN7sD3sJ-bfHuOmcxKJ6a1QRyyeAKOPQeWx92zo2oiC6jaRyttyp46_I0Cd2iWkDvmU2ftAssFWj4lVVOtqDsQhnZKX-M6UraIdddyDrFT8wqY4WXOF-lQsObBZgJUycE1vWg6KVSLvfNlAjUSds3rRVDUKW3_7XB4x6zgm7LOjiRs_W347MUKKCzxTHadC-d1KMVAMDgZ1VraIEaW08xGOhBMPKEofuQHx47cpBB1t3rag1XzkzhOCm_P_kivwo9CqfuQqalp1yrV90mkoc0NvNRm7DQrOSRWw"
    let transactionId = event.Records[0].messageAttributes.transaction_id.stringValue
    console.log(event.Records[0].messageAttributes)
    queryDB(transactionId)


    function queryDB(transactionId) {
        let params = {
            TableName: "FesTransaction",

            Key: {
                "transactionId": transactionId
            }
        }

        docClient.get(params, (err, data) => {
            if (err) {
                callback(err, err)
            }
            else {
                console.log(data)
                retrieveCognitoSub(data.Item.sender, data.Item.documentUri)
            }
        })

    }

    function retrieveCognitoSub(sender, document) {
        var params = {
            UserPoolId: 'eu-west-2_i26ambKSW',
            /* required */
            AttributesToGet: [
                'sub',
            ],
            Filter: "email = \"" + sender + "\"",
            Limit: 10,

        };
        cognitoidentityserviceprovider.listUsers(params, function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
                console.log(data.Users[0].Attributes[0].Value)
                transferSignature(data.Users[0].Attributes[0].Value, document)

            }
        });
    }

    function transferDocument(senderSub, document) {
        var str = document;
        var n = str.lastIndexOf('/');
        var trimmed_document = str.substring(n + 1);
        let srcBucket = "fes-filestorage"
        let destBucket = srcBucket
        let sourceObject = trimmed_document
        s3.copyObject({
            CopySource: destBucket + "/" + "userDocs/" + senderSub + "/" + transactionId + "/" + trimmed_document,
            Bucket: destBucket + "/" + "userDocs/" + jwt_reciever.sub + "/" + transactionId,
            Key: sourceObject
        }, (copyErr, copyData) => {
            if (copyErr) {
                console.log(copyErr)
            }
            else {
                console.log(copyData)
                setToResolved()
            }
        });
    }

    function transferSignature(senderSub, document) {
        let srcBucket = "fes-filestorage"
        let destBucket = srcBucket
        let sourceObject = "signatureReciever"
        s3.copyObject({
            CopySource: destBucket + "/" + "userDocs/" + jwt_reciever.sub + "/" + transactionId + "/" + "signatureReciever",
            Bucket: destBucket + "/" + "userDocs/" + senderSub + "/" + transactionId,
            Key: sourceObject
        }, (copyErr, copyData) => {
            if (copyErr) {

                console.log(copyErr)
            }
            else {
                console.log(copyData)
                transferDocument(senderSub, document)
            }
        });
    }

    function setToResolved() {
        var params = {
            TableName: "FesTransaction",
            Key: {
                "transactionId": transactionId
            },
            UpdateExpression: "set transactionState= :ts",
            ExpressionAttributeValues: {
                ":ts": "Resolved",
            },
            ReturnValues: "UPDATED_NEW"
        };

        docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            }
            else {
                console.log("Update Success")
                console.log(data)
            }
        });
    }

};
