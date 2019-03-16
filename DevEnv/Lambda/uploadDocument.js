const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ resgion: 'us-east-2' });
// const request = require('request')
const s3 = new AWS.S3({
    signatureVersion: 'v4'
});


exports.handler = function (event, context, callback) {
    let req = event;
    let jwtToken = req.jwtToken;

    let decodedJwt = jwt.decode(jwtToken)
    console.log(decodedJwt)
    let fileName = req.filename
    let sub = decodedJwt.sub

    let s3params = {
        Bucket: 'fes-filestorage',
        Key: 'userDocs/' + sub + '/' + fileName,
        Expires: 36000
    };


    const getSignedUrlPromise = (operation, params) =>
        new Promise((resolve, reject) => {
            s3.getSignedUrl(operation, params, (err, url) => {
                console.log(url)
                err ? reject(err) : resolve(url);
            });
        });

    getSignedUrlPromise('putObject', s3params)
        .then((url) => {
            let response = {
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                },
                "body": url,
                "isBase64Encoded": true
            };
            callback(null, response)
        })
        .catch((err) => {
            callback(null, err)
        })
};
