   let response = {
        "statusCode": 200,
        "headers": {
            "my_header": "my_value",
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        "body": JSON.stringify(data),        
};