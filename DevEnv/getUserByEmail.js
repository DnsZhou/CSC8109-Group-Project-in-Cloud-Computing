//Unfinished
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

exports.handler = (event, context, callback) => {
  
    console.log("currentEmail: ", event.email)
    let params = {
        TableName: "FesUser",
        FilterExpression:'email = :email',
        ExpressionAttributeValues:{ ":email" : event.email }
    }

    docClient.scan(params, function (err, data) {
        if (err) {
            const response = {
                statusCode: 500,
                body: JSON.stringify('Error while reading User from DB'),
            };
            callback(err, response);
        } else if(data.Items.length==0){
            const response = {
                statusCode: 404,
                body: JSON.stringify('User with email ' + event.email +' not found in system' ),
            };
            callback(err, response);
        } else {
            const response = {
                statusCode: 200,
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(data.Items),
            };
            callback(null, response);
            
        }
    });
};

