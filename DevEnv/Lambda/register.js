var aws = require('aws-sdk');
let keypair = require('keypair')
const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();
const docClient = new aws.DynamoDB.DocumentClient({ region: 'eu-west-2' });
exports.handler = (event, context, callback) => {
    console.log(event);

    if (event.request.userAttributes.email) {
        var userAttributes = event.request.userAttributes;
        addUserInDb(userAttributes.sub, userAttributes.email, userAttributes.name, callback, event);
    } else {
        callback(null, event);
    }
};

function addUserInDb(sub, email, fullName, callback, event) {
    console.log("sub: " + sub + "email: " + email + "fullName: " + fullName)
    let params = {
        Item: {
            email: email,
            fullName: fullName,
            sub: sub
        },
        TableName: "FesUser"
    }

    docClient.put(params, (err, data) => {
        if (err) {
            callback(err, event);
        }
        else {
            addKeyPair(sub, email, event)
            // callback(null, event);
            //Todo: call 

        }
    })

    function addKeyPair(sub, email, event) {
        let pair = keypair();
        let publicKey = pair.public
        let privateKey = pair.private

        let params = {
            "Body": publicKey,
            "ContentEncoding": 'utf8',
            "Bucket": 'public-keys-cloudproject',
            "Key": email + '/publicKey.pem'
        };

        let paramsPrivate = {
            "Body": privateKey,
            "ContentEncoding": 'utf8',
            "Bucket": 'private-keys-cloud',
            "Key": sub + '/privateKey.pem'
        };

        s3.upload(params, function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                s3.upload(paramsPrivate, function (err, datas) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, event);
                    }
                });
            }
        });
    }
}