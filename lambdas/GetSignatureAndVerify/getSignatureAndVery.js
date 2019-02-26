const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();
const crypto = require('crypto')

exports.handler = (event, context, callback) => {
    let paramsSignature= {Bucket: 'private-keys-cc', Key: 'signature'}
    let paramsDocument = {Bucket: 'private-keys-cc', Key: 'test.txt'}
    let paramsPublic = {Bucket: 'private-keys-cc', Key: 'publicKeyUTF.pem'}
     s3.getObject(paramsSignature, function(err, dataSignature) {
        if (err) {            
            callback(err, "Oh No")
        }
        else {
             s3.getObject(paramsDocument, function(err, dataDocument) {
                if (err) {            
                    callback(err, "Oh No")
                }
                else {
                    s3.getObject(paramsPublic, function(err, dataPublicKey) {
                        if (err) {            
                            callback(err, "Oh No")
                        }
                        else {
                            let documentObject = dataDocument.Body.toString();
                            let signatureObject = dataSignature.Body
                            documentObject = crypto.createHash('md5').update(documentObject).digest('hex');
                            const verifier = crypto.createVerify('sha256');
                            verifier.update(documentObject);
                            verifier.end();
                            const verified = verifier.verify(dataPublicKey.Body.toString(), signatureObject);
                            callback(null, verified);
                        }
                    });
                    
                }
            });
            
        }
    });
    
};
