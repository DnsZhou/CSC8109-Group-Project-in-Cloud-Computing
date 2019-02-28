const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3()

exports.handler = (event, context, callback) => {
    
    var params = {
        Bucket: 'private-keys-cc', 
        Key: 'test.txt',
        Expires: 600
    };
    s3.getSignedUrl('getObject', params, function(err, data) {
        if(err) {
            let response = {
                "statusCode": 500,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                },
                     "body": JSON.stringify(data),
                     "isBase64Encoded": true
             };
                 callback(null, err);
        }
        else {
            let response = {
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                },
                     "body": JSON.stringify(data),
                     "isBase64Encoded": true
             };
                 callback(null, response);
        }
    })
    
};
