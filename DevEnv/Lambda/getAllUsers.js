const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

exports.handler = (event, context, callback) => {
  

    let params = {
        TableName: "FesUser"
    }

    docClient.scan(params, function (err, data) {
        if (err) {
            const response = {
                statusCode: 500,
                body: JSON.stringify('Error while reading User from DB'),
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
            // testConnection(callback);
            
        }
    });
    
};
