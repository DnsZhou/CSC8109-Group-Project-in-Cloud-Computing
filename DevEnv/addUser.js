//Todo: add validation to prevent duplicate email address
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

exports.handler = (event, context, callback) => {
    let incoming_params = JSON.parse(event.body);
    let email_param = incoming_params.email;
    let first_name_param = incoming_params.first_name;
    let last_name_param = incoming_params.last_name;
    let emailDuplicateFlag = true;

    let params = {
        Item: {
            email: email_param,
            first_name: first_name_param,
            last_name: last_name_param
        },
        TableName: "FesUser"
    }

    if (!validateEmailNotNull(params.Item.email)) {
        console.log("in null valid failed")
        const response = {
            statusCode: 400,
            body: JSON.stringify('Bad Request: Wrong format of Email'),
        };
        callback(null, response);
    }
    else {

        var p = new Promise(function (resolve, reject) {
            let queryParams = {
                TableName: "FesUser",
                FilterExpression: 'email = :email',
                ExpressionAttributeValues: { ":email": params.Item.email }
            }
            docClient.scan(queryParams, function (err, data) {
                console.log("in select length" + data.Items.length)
                if (err) {
                    console.log("in error")
                    emailDuplicateFlag = true;
                } else if (data.Items.length == 0) {
                    console.log("in ok")
                    emailDuplicateFlag = false;
                } else {
                    console.log("in duplicate")
                    emailDuplicateFlag = true;
                }
                resolve();
            });
        })

        p.then(function () {
            if (emailDuplicateFlag) {
                console.log("in dup valid failed")
                const response = {
                    statusCode: 409,
                    body: JSON.stringify('Bad Request: Email conflict with exist user'),
                };
                callback(null, response);
            } else {
                console.log("in succeed")
                docClient.put(params, (err, data) => {
                    if (err) {
                        const response = {
                            statusCode: 500,
                            body: JSON.stringify('Error while writing to DB'),
                        };
                        callback(err, response);
                    }
                    else {
                        const response = {
                            statusCode: 200,
                            body: JSON.stringify(params),
                        };
                        callback(null, response);
                    }
                })
            }

        })
    }

};

const validateEmailNotNull = (email) => {
    return (email && email.trim())
};
