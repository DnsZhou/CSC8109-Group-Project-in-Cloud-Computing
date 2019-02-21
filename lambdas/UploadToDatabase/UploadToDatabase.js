const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = (event, context, callback) => {
    let incoming_params = JSON.parse(event.body);
    let email_param = incoming_params.email;
    let first_name_param = incoming_params.first_name;
    let last_name_param = incoming_params.last_name;
    
    let params = {
        Item: {
            email: email_param,
            first_name: first_name_param,
            last_name: last_name_param
        },
        
        TableName: "User_Table"
    }
    
    docClient.put(params, (err, data) => {
        if(err) {
            
        const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
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
};

