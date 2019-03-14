const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();
const crypto = require('crypto')
let decoded = require('jwt-decode')
var kms = new AWS.KMS({ apiVersion: '2014-11-01' });

exports.handler = (event, context, callback) => {
    let JSON_PARSED = JSON.parse(event.body)

    let decode = decoded(JSON_PARSED.jwt)
    let paramsPrivate = { Bucket: 'private-keys-london-cloud', Key: decode.sub + '/privateKey' }
    let documentLocation = JSON_PARSED.document_location
    let paramsDocument = { Bucket: 'fes-filestorage', Key: "userDocs/" + decode.sub + "/" + documentLocation }

    s3.getObject(paramsPrivate, function (err, datas) {
        console.log(paramsPrivate.Key)
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback(err, "Oh No");

        }
        else {
            decrypt(datas)
        }
    });

    function createVerifier(key) {
        s3.getObject(paramsDocument, function (err, dataDocument) {
            if (err) {
                console.log(err)
                callback(err, "Something Went Wrong")
            }
            else {
                let documentString = dataDocument.Body.toString();
                let hash = crypto.createHash('md5').update(documentString).digest('hex');
                let private_key = key
                const signer = crypto.createSign('sha256');
                signer.update(hash);
                signer.end();

                const signature = signer.sign(private_key);
                let signature_base64 = signature.toString('base64')
                const signature_hex = signature.toString('hex');

                let paramsSignature = {
                    "Body": signature,
                    "Bucket": 'fes-filestorage',
                    "Key": "userDocs/" + decode.sub + "/" + 'signatureSender'
                };

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

    function decrypt(data) {
        // console.log(data.CiphertextBlob)
        var params = {
            CiphertextBlob: data.Body
        };
        kms.decrypt(params, function (err, data) {
            if (err) {
                console.log(err)
                callback(err, err.stack); // an error occurred
            }
            else {
                createVerifier(data.Plaintext.toString())
                console.log(data); // successful response
                // callback(null, data.Plaintext.toString())
            }

        });
    } // successful response

}
