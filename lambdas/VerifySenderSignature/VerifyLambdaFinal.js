
const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();
const crypto = require('crypto')
exports.handler = (event, context, callback) => {
    
    let paramsPublic = {Bucket: 'private-keys-cc', Key: 'publicKeyUTF.pem'}
    let paramsPrivate = {Bucket: 'private-keys-cc', Key: 'privateKeyUTF.pem'}
    let paramsDocument = {Bucket: 'private-keys-cc', Key: 'test.txt'}
    
    let public_key;
    s3.getObject(paramsPublic, function(err, data) {
        if (err) {            
            callback(err, "Oh No")
        }
        else {
        public_key = data.Body.toString()
        
            s3.getObject(paramsPrivate, function(err, datas) {
                if (err) {
                console.log(err, err.stack); // an error occurred
                callback(err, "Oh No");
                
                }
                else {
                        // let message = "Hello"
                        // let private_key = datas.Body.toString();
                        // const signer = crypto.createSign('sha256');
                        // signer.update(message);
                        // signer.end();

                        // const signature = signer.sign(private_key);
                        // const signature_hex = signature.toString('hex');
    
                        // const verifier = crypto.createVerify('sha256');
                        // verifier.update(message);
                        // verifier.end();

                        // const verified = verifier.verify(public_key, signature);
                        // callback(null, "True")
                        
                s3.getObject(paramsDocument, function(err, dataDocument) {
                    if(err) {
                        callback(err, "Something Went Wrong")
                    }
                    else {
                        let documentString = dataDocument.Body.toString();
                        let hash = crypto.createHash('md5').update(documentString).digest('hex');
                        let private_key = datas.Body.toString();
                        const signer = crypto.createSign('sha256');
                        signer.update(hash);
                        signer.end();

                        const signature = signer.sign(private_key);
                        const signature_hex = signature.toString('hex');
    
                        const verifier = crypto.createVerify('sha256');
                        verifier.update(hash);
                        verifier.end();

                        const verified = verifier.verify(public_key, signature);
                        callback(null, verified)
                    }
                })
                
             }
         });
            
                      // successful response
        }
    });
}
