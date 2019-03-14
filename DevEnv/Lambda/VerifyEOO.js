const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();
const crypto = require('crypto')
let decoded = require('jwt-decode')
exports.handler = (event, context, callback) => {
    let JSON_PARSED = JSON.parse(event.body)
    let decode = decoded(JSON_PARSED.jwt)
    let documentLocation = JSON_PARSED.document_location
    let paramsDocument = { Bucket: 'fes-filestorage', Key: "userDocs/" + decode.sub + "/" + documentLocation }
    let paramsPublic = { Bucket: 'public-keys-london-cloud', Key: decode.email + '/publicKey.pem' }
    let signature_base64 = JSON_PARSED.signature_base64

    s3.getObject(paramsDocument, function (err, dataDocument) {
        if (err) {
            callback(err, "Oh No")
        }
        else {
            s3.getObject(paramsPublic, function (err, dataPublicKey) {
                if (err) {
                    callback(err, "Oh No")
                }
                else {
                    let documentObject = dataDocument.Body.toString();
                    //let signatureObject = dataSignature.Body
                    let signature_base64_toBuffer = Buffer.from(signature_base64, 'base64')
                    // let signatureObject = Buffer.from("niuYbz487JGMBNhruUgcjbfdHzjUsXIE0TpGLqFbBmuirGRSz5Q6d1xpRc9Yy5GH1YjJxc1DiKKugOGsuA5N9NZHK5Sn+LhMsgm+OxRie2uYGglM1vSpCn8umkb/bT0RQK+ceWjIH0d3+1rUoJ3Tj628uAaF/zLOx0s+VYOwwpKjCfx/9tYODfY/sXgO4wOBmAQMnEwgIi5oyfY433uvGS9Jl//fwu8O/ynNtmxhgxA71Jv6Nqg1VodyDmPZraz8x8dfsBkVVkbLzGIFC803uO7/DBIDpxd1oVmbBxYBbCKAWRPHaT2GvG9N47CgAmgoNQjEwpMQGEM6s5orbyyqvg==")
                    documentObject = crypto.createHash('md5').update(documentObject).digest('hex');
                    const verifier = crypto.createVerify('sha256');
                    verifier.update(documentObject);
                    verifier.end();
                    const verified = verifier.verify(dataPublicKey.Body.toString(), signature_base64_toBuffer);

                    const response = {
                        statusCode: 200,
                        "headers": {
                            "my_header": "my_value",
                            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                        },
                        body: JSON.stringify(verified),
                    };

                    callback(null, response);
                }
            });

        }
    });

};
