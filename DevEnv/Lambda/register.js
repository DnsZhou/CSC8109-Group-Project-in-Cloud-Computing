var aws = require('aws-sdk');
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

function addUserInDb(sub,email,fullName, callback, event){
    console.log("sub: "+sub+"email: "+email+"fullName: "+fullName)
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
        callback(null, event);
    }
})
}