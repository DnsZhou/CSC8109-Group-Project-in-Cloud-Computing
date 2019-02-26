//Unfinished
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

exports.handler = (event, context, callback) => {
    var emailNotExists = true;
    const thisEmail = event.queryStringParameters.email
    console.log("currentEmail: ", thisEmail)
    let params = {
        TableName: "FesUser",
        Key: {
            "email": thisEmail
        },
    }

    if (!thisEmail || !thisEmail.trim()) {
        console.log("in null valid failed")
        const response = {
            statusCode: 400,
            body: JSON.stringify('Bad Request: Wrong format of Email'),
        };
        callback(null, response);
    } else {
        var p = new Promise(function (resolve, reject) {
            let queryParams = {
                TableName: "FesUser",
                FilterExpression: 'email = :email',
                ExpressionAttributeValues: { ":email": thisEmail }
            }
            docClient.scan(queryParams, function (err, data) {
                console.log("in select length" + data.Items.length)
                if (err) {
                    emailNotExists = true;
                } else if (data.Items.length > 0) {
                    emailNotExists = false;
                } else {
                    emailNotExists = true;
                }
                resolve();
            });
        })

        p.then(function () {
            docClient.delete(params, function (err, data) {
                if (err) {
                    const response = {
                        statusCode: 500,
                        body: JSON.stringify('Error while deleting User ' + thisEmail + ' from DB'),
                    };
                    callback(err, response);
                } else if (emailNotExists) {
                    const response = {
                        statusCode: 404,
                        body: JSON.stringify('User ' + thisEmail + ' not found in DB'),
                    };
                    callback(err, response);
                } else {
                    const response = {
                        statusCode: 200,
                        body: JSON.stringify('Delete user ' + thisEmail + ' succeeded'),
                    };
                    callback(null, response);

                }
            });
        })

    }
};

