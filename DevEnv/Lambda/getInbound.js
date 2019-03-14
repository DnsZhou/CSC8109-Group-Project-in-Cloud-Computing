const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

exports.handler = function (event, context, callback) {

    let jwtToken = JSON.parse(event.jwt);

    let decodedJwt = jwt.decode(jwtToken)
    // let decodedJwt = jwt.decode("eyJraWQiOiJZbDRZbWFoSnBZK0NLSTJlYkNOOHBReDZnVXJGbVlSTjlSU1hiSHMrQW00PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4MDg0NDUxOS0wM2Y2LTQ3YWUtOGJkMS0xZWVhMTkxOTIxNzciLCJhdWQiOiI3dWwwYnFpZGhocThqbTE1Mm82Z2prcWk1ZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6IjRkZjUwYTI4LTNmYWMtMTFlOS05NmQ5LTNmYmM3MjRmOGM1NCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTUxODM0NDg4LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl9pMjZhbWJLU1ciLCJuYW1lIjoiQ2hyaXN0b3BoZXIiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2hyaXN5Lmxpa2VzLnBpZUBnb29nbGVtYWlsLmNvbSIsImV4cCI6MTU1MTgzODA4OCwiaWF0IjoxNTUxODM0NDg4LCJlbWFpbCI6ImNocmlzeS5saWtlcy5waWVAZ29vZ2xlbWFpbC5jb20ifQ.llIYiCqZ_iCZbH5q0-uH41LB-E2WaE2SwXCHkNiCIkGgh6N_wk1BmmxbmOC96Ax_3OF--SvGclBVL6dT8IiAZi82toeCnqy9q9Fjrn_tyZTRgTUZj4Fq4eY_wtGOCaTgCLqkaRiSOf8b6vKxWJRvR3zCHmU443o8ubHHk595PMau7NX3tAdElwTwNpW4muV4Z_fNl3hnF_PTWYMrhDZ7w8oRLO8LOas5kbgdwA4oTQL_Me5t-P-KsFpsMdt4Zr35Xly6UgWee5mYHR3RsLRe10Hr1OtKT0mncMtWuPEnlcEss0dkXg8TsWDDDJ85-PVLKm5EuR9kZ2xYfor3vKJQcw")

    // let fromEmail = 'j.wang81@ncl.ac.uk';
    let fromEmail = decodedJwt.email;
    console.log(fromEmail)

    let params = {
        TableName: 'FesTransaction'
    };

    docClient.scan(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err, null);
        } else {

            let response = {
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                },
                "body": JSON.stringify(processData(fromEmail, data)),
                "isBase64Encoded": true
            };

            callback(null, response);
        }
    });
};

const processData = (fromEmail, data) => {
    console.log(fromEmail);
    data = data.Items;
    let res = [];
    for (var i = 0; i < data.length; i++) {
        userData = {}
        if (fromEmail == data[i].reciever) {
            userData.transactionId = data[i].transactionId,
                userData.reciever = data[i].reciever,
                userData.sender = data[i].sender,
                userData.status = data[i].transactionState,
                // userData.state = data[i].state,
                userData.createTime = data[i].createTime,
                userData.updateTime = data[i].updateTime,
                res.push(userData);
        } else {
            // return 'data error';
        }
    }
    return res;
};