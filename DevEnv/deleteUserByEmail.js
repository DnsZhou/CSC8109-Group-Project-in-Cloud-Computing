//Unfinished
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

exports.handler = (event, context, callback) => {

    console.log("currentEmail: ", event.email)
    let params = {
        TableName: "FesUser",
        Key: {
            "email": event.email
        },
    }

    if (!event.email || !event.email.trim()) {
        console.log("in null valid failed")
        const response = {
            statusCode: 400,
            body: JSON.stringify('Bad Request: Wrong format of Email'),
        };
        callback(null, response);
    } else {
        docClient.delete(params, function (err, data) {
            if (err) {
                const response = {
                    statusCode: 500,
                    body: JSON.stringify('Error while deleting User ' + event.email + ' from DB'),
                };
                callback(err, response);
            } else {
                const response = {
                    statusCode: 200,
                    body: JSON.stringify('Delete user ' + event.email + ' succeeded'),
                };
                callback(null, response);

            }
        });
    }
};

