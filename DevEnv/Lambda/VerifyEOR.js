const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();
const crypto = require('crypto')
let decoded = require('jwt-decode')
exports.handler = (event, context, callback) => {
    let JSON_PARSED = JSON.parse(event.body)
    let decodedReciever = decoded(JSON_PARSED.jwt_reciever)
    // let decodedReciever = decoded("eyJraWQiOiJZbDRZbWFoSnBZK0NLSTJlYkNOOHBReDZnVXJGbVlSTjlSU1hiSHMrQW00PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4MDg0NDUxOS0wM2Y2LTQ3YWUtOGJkMS0xZWVhMTkxOTIxNzciLCJhdWQiOiI3dWwwYnFpZGhocThqbTE1Mm82Z2prcWk1ZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6IjNlMzBmMzMzLTQxYTctMTFlOS1iZWZiLTMzNGQ4OTFmMGJhNCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTUyMDUyMjE3LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl9pMjZhbWJLU1ciLCJuYW1lIjoiQ2hyaXN0b3BoZXIiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2hyaXN5Lmxpa2VzLnBpZUBnb29nbGVtYWlsLmNvbSIsImV4cCI6MTU1MjA1NTgxNywiaWF0IjoxNTUyMDUyMjE3LCJlbWFpbCI6ImNocmlzeS5saWtlcy5waWVAZ29vZ2xlbWFpbC5jb20ifQ.XdwSof2PrV2apXWNHpvmPaWkAw8ms_m2MIwQn25eOaxkWv9z4_OkN7sD3sJ-bfHuOmcxKJ6a1QRyyeAKOPQeWx92zo2oiC6jaRyttyp46_I0Cd2iWkDvmU2ftAssFWj4lVVOtqDsQhnZKX-M6UraIdddyDrFT8wqY4WXOF-lQsObBZgJUycE1vWg6KVSLvfNlAjUSds3rRVDUKW3_7XB4x6zgm7LOjiRs_W347MUKKCzxTHadC-d1KMVAMDgZ1VraIEaW08xGOhBMPKEofuQHx47cpBB1t3rag1XzkzhOCm_P_kivwo9CqfuQqalp1yrV90mkoc0NvNRm7DQrOSRWw")
    let transaction_id = JSON_PARSED.transaction_id
    // let transaction_id = "c1ad6ef1-76cb-4576-ae56-3c49bb289427"
    let paramsSignatureSender = { Bucket: 'fes-filestorage', Key: "userDocs/" + decodedReciever.sub + "/" + transaction_id + '/signatureSender' }
    let paramsSignatureReciever = JSON_PARSED.signatureReciever_base64
    // let paramsSignatureReciever = "ddydjkIKTsfcCz6e2wxJ4D6SbaQduT0G5mfXFJDkxajcG42GdkmvAD7gAUgamf3TYLYwKegeI+q3L64VVVUCHL3zoXrQuloC3UAfQTDIHamUuiwsDglBqEsskYDN79ySzpBDMFl3cJxGi2DN0ZODYb5F7PUxSbR5b93iTmv2npmNT53JmA+reH8nwjiPgTOG4Fd1tarXlndsnPGTYZAY+t0w3fzd3P4WhGAuMSM4HJL+PMQghvhU63Cx/rqSNZY1our74Ct2lN0LZf0uPzeMmPUo8u3mwgZvJTgy1X1a9tH/m2LFzOv+i7ZYD3oGX207hVt8lYsnuF3W4RtMRWRw1g=="
    let paramsPublicKey = { Bucket: 'public-keys-london-cloud', Key: decodedReciever.email + '/publicKey.pem' }

    s3.getObject(paramsPublicKey, function (err, dataPublicKey) {
        if (err) {
            callback(err, "Oh No")
        }
        else {
            s3.getObject(paramsSignatureSender, function (err, dataSignatureSender) {
                if (err) {
                    callback(err, "Oh No")
                }
                else {
                    let signatureSender = dataSignatureSender.Body
                    let signatureReciever = Buffer.from(paramsSignatureReciever, 'base64')
                    const verifier = crypto.createVerify('sha256');
                    verifier.update(signatureSender);
                    verifier.end();
                    const verified = verifier.verify(dataPublicKey.Body.toString(), signatureReciever);
                    const response = {
                        statusCode: 200,
                        "headers": {
                            "my_header": "my_value",
                            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                        },
                        body: JSON.stringify(verified)
                    };
                    callback(null, response)
                }
            })
        }
    })
};
