const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();
const crypto = require('crypto')

exports.handler = (event, context, callback) => {
    let paramsPrivateKey = {Bucket: 'private-keys-cc', Key: 'privateKeyRecieverUTF.pem'}
    let paramsSignature= {Bucket: 'private-keys-cc', Key: 'signatureSender'}
    
    s3.getObject(paramsPrivateKey, function(err, dataPrivateKey) {
        if (err) {            
            callback(err, "Oh No")
        }
        else {
            s3.getObject(paramsSignature, function(err, dataSignature) {
                if (err) {            
                    callback(err, "Oh No")
                }
                else {
                    const signer = crypto.createSign('sha256');
                    signer.update(dataSignature.Body);
                    signer.end();
                    const signature = signer.sign(dataPrivateKey.Body.toString());
                    
                    let paramsSignature = {
                        "Body": signature,                
                        "Bucket": 'private-keys-cc',
                        "Key": 'signatureReciever'  
                        };

                        s3.upload(paramsSignature, function(err, uploadSignature){
                            if(err) {
                                callback(err, "Oh No");
                            } 
                            else {
                                callback(null, uploadSignature);
                            }
                        });
                }
            })
        }
    })        
};
