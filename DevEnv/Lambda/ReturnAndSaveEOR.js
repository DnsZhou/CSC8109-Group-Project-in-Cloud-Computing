const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();
const crypto = require('crypto')
let decoded = require('jwt-decode')
var kms = new AWS.KMS({ apiVersion: '2014-11-01' });

exports.handler = (event, context, callback) => {
    let JSON_PARSED = JSON.parse(event.body)
    let decodeReciever = decoded(JSON_PARSED.jwt_reciever)
    // let decodeReciever = decoded("eyJraWQiOiJZbDRZbWFoSnBZK0NLSTJlYkNOOHBReDZnVXJGbVlSTjlSU1hiSHMrQW00PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4MDg0NDUxOS0wM2Y2LTQ3YWUtOGJkMS0xZWVhMTkxOTIxNzciLCJhdWQiOiI3dWwwYnFpZGhocThqbTE1Mm82Z2prcWk1ZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6IjNlMzBmMzMzLTQxYTctMTFlOS1iZWZiLTMzNGQ4OTFmMGJhNCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTUyMDUyMjE3LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl9pMjZhbWJLU1ciLCJuYW1lIjoiQ2hyaXN0b3BoZXIiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2hyaXN5Lmxpa2VzLnBpZUBnb29nbGVtYWlsLmNvbSIsImV4cCI6MTU1MjA1NTgxNywiaWF0IjoxNTUyMDUyMjE3LCJlbWFpbCI6ImNocmlzeS5saWtlcy5waWVAZ29vZ2xlbWFpbC5jb20ifQ.XdwSof2PrV2apXWNHpvmPaWkAw8ms_m2MIwQn25eOaxkWv9z4_OkN7sD3sJ-bfHuOmcxKJ6a1QRyyeAKOPQeWx92zo2oiC6jaRyttyp46_I0Cd2iWkDvmU2ftAssFWj4lVVOtqDsQhnZKX-M6UraIdddyDrFT8wqY4WXOF-lQsObBZgJUycE1vWg6KVSLvfNlAjUSds3rRVDUKW3_7XB4x6zgm7LOjiRs_W347MUKKCzxTHadC-d1KMVAMDgZ1VraIEaW08xGOhBMPKEofuQHx47cpBB1t3rag1XzkzhOCm_P_kivwo9CqfuQqalp1yrV90mkoc0NvNRm7DQrOSRWw")
    // let decodeSender = decoded(JSON_PARSED.jwt_sender)
    let transaction_id = JSON_PARSED.transaction_id
    // let transaction_id = "c1ad6ef1-76cb-4576-ae56-3c49bb289427"
    let paramsPrivate = { Bucket: 'private-keys-london-cloud', Key: decodeReciever.sub + '/privateKey' }
    let paramsSignature = { Bucket: 'fes-filestorage', Key: "userDocs/" + decodeReciever.sub + "/" + transaction_id + '/signatureSender' }

    s3.getObject(paramsPrivate, function (err, datas) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback(err, "Oh No");

        }
        else {
            decrypt(datas.Body)
        }
    });

    function createVerifier(key) {
        s3.getObject(paramsSignature, function (err, dataDocument) {
            if (err) {
                console.log(err)
                callback(err, "Something Went Wrong")
            }
            else {
                let documentString = dataDocument.Body
                let private_key = key
                const signer = crypto.createSign('sha256');
                signer.update(documentString);
                signer.end();

                const signature = signer.sign(private_key);
                let signature_base64 = signature.toString('base64')
                const signature_hex = signature.toString('hex');

                let paramsSignature = {
                    "Body": signature,
                    Bucket: 'fes-filestorage',
                    Key: "userDocs/" + decodeReciever.sub + "/" + transaction_id + '/signatureReciever'

                }

                s3.upload(paramsSignature, function (err, datas) {
                    if (err) {
                        console.log(err)
                        callback(err, "Oh No");
                    }
                    else {
                        const response = {
                            statusCode: 200,
                            "headers": {
                                "my_header": "my_value",
                                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                            },
                            body: JSON.stringify(signature_base64)
                        };
                        callback(null, response);
                    }
                });
            }
        })
    }

    function decrypt(key) {
        var params = {
            CiphertextBlob: key
        };
        kms.decrypt(params, function (err, data) {
            if (err) {
                console.log(err)
                callback(err, err.stack); // an error occurred
            }
            else {
                console.log(data); // successful response
                createVerifier(data.Plaintext.toString())
            }

        });
    }

}
