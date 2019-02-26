const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();
var fs = require('fs');
var keypair = require('keypair');
exports.handler = (event, context, callback) => {
    
    let pair = keypair();
	console.log(pair.public);
	console.log(pair.private);
// 	let publicKey = Buffer.from(pair.private).toString('base64');
	let publicKey = pair.public
	let privateKey = pair.private
     let params = {
       "Body": publicKey,
       "ContentEncoding": 'utf8',
       "Bucket": 'private-keys-cc',
       "Key": 'publicKeyUTF.pem'  
    };
    
    let paramsPrivate = {
       "Body": privateKey,
       "ContentEncoding": 'utf8',
       "Bucket": 'private-keys-cc',
       "Key": 'privateKeyUTF.pem'  
    };
    
    s3.upload(params, function(err, data){
       if(err) {
           callback(err, null);
       } else {
           s3.upload(paramsPrivate, function(err, datas){
            if(err) {
           callback(err, null);
            } else {
           callback(null, "Yay");
         }
            });
    }
    });
    
};

