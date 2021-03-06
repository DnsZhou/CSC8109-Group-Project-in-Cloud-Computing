const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = (event, context, callback) => {
    let parsed_json = JSON.parse(event.body)
    let email = parsed_json.email
    let table_name  = “User_Table” 
    let params = {
        TableName: table_name,
    
    Key: {
        "email" : email
    }
}

    docClient.get(params, (err, data) => {
        if(err) {
             const response = {
            statusCode: 400,
            "headers": {
                        "my_header": "my_value",
                        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                    },
            body: JSON.stringify(err),
        };
            callback(null, response);
        }
        else {
            const response = {
            statusCode: 200,
            "headers": {
                        "my_header": "my_value",
                        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                    },
            body: JSON.stringify(data),
        };
            callback(null, response);
        }
    })
   
};

