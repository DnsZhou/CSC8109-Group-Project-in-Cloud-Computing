const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();
const crypto = require('crypto')

exports.handler = (event, context, callback) => {
    let paramsSignatureSender= {Bucket: 'private-keys-cc', Key: 'signatureSender'}
    let paramsSignatureReciever = {Bucket: 'private-keys-cc', Key: 'signatureReciever'}
    let paramsPublicKey = {Bucket: 'private-keys-cc', Key: 'publicKeyRecieverUTF.pem'}
    
    s3.getObject(paramsPublicKey, function(err, dataPublicKey) {
        if (err) {            
            callback(err, "Oh No")
        }
        else {
            s3.getObject(paramsSignatureReciever, function(err, dataSignatureReciever) {
                if (err) {            
                 callback(err, "Oh No")
                }
                else {
                    s3.getObject(paramsSignatureSender, function(err, dataSignatureSender) {
                        if (err) {            
                        callback(err, "Oh No")
                        }
                        else {
                            let signatureSender = dataSignatureSender.Body
                            let signatureReciever = dataSignatureReciever.Body
                            
                            const verifier = crypto.createVerify('sha256');
                            verifier.update(signatureSender);
                            verifier.end();
                            const verified = verifier.verify(dataPublicKey.Body.toString(), signatureReciever);
                            callback(null, verified)
                        }
                    })
                }
            })
        }
    })
};
