var aws = require('aws-sdk');
let keypair = require('keypair')
const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3();
const docClient = new aws.DynamoDB.DocumentClient({ region: 'eu-west-2' });
var kms = new AWS.KMS({ apiVersion: '2014-11-01' });
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
            fullName: fullName
        },
        TableName: "FesUser"
    }

    docClient.put(params, (err, data) => {
        if (err) {
            console.log(err)
            callback(err, event);
        }
        else {
            encrypt(sub, email, event)
            // callback(null, event);
            //Todo: call 

        }
    })


    function encrypt(sub, email, event) {
        let pair = keypair();
        let publicKey = pair.public
        let privateKey = pair.private

        var params = {
            KeyId: "arn:aws:kms:eu-west-2:663486236311:key/07b286ae-e58a-4be6-a5ff-65f4dc7f2805",
            Plaintext: privateKey
        };
        kms.encrypt(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            }
            else {
                addKeyPair(sub, email, event, data, publicKey)
            }
        });
    }


    function addKeyPair(sub, email, event, data, publicKey) {


        let params = {
            "Body": publicKey,
            "ContentEncoding": 'utf8',
            "Bucket": 'public-keys-london-cloud',
            "Key": email + '/publicKey.pem'
        };

        let paramsPrivate = {
            "Body": data.CiphertextBlob,
            "ContentEncoding": 'utf8',
            "Bucket": 'private-keys-london-cloud',
            "Key": sub + '/privateKey'
        };

        s3.upload(params, function (err, data) {
            if (err) {
                console.log(err)
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