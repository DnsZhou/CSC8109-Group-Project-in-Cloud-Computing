const AWS = require('aws-sdk');
//*/ get reference to S3 client 
var s3 = new AWS.S3()
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });
let decoded = require('jwt-decode')
exports.handler = (event, context, callback) => {
    let JSON_PARSED = JSON.parse(event.body)
    let jwt = decoded(JSON_PARSED.jwt)

    // let jwt = decoded("eyJraWQiOiJZbDRZbWFoSnBZK0NLSTJlYkNOOHBReDZnVXJGbVlSTjlSU1hiSHMrQW00PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJiZWY4MmNkNy00ZmZkLTQ3MTEtODhkOC00ZmI2ZTVlYzkzNzciLCJhdWQiOiI3dWwwYnFpZGhocThqbTE1Mm82Z2prcWk1ZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6IjQ4M2FiYzliLTQ0MWQtMTFlOS1hMGQyLTdmMmMxMzVmMTkwOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTUyMzIyODE2LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl9pMjZhbWJLU1ciLCJuYW1lIjoiQ2hyaXN0b3BoZXIiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2hyaXMuY2xhcms4NzZAZ21haWwuY29tIiwiZXhwIjoxNTUyMzI2NDE2LCJpYXQiOjE1NTIzMjI4MTYsImVtYWlsIjoiY2hyaXMuY2xhcms4NzZAZ21haWwuY29tIn0.puLYDldJplYENwfBX9CT9Lc7aCJ8sbQjPk_hKxWbzbF4M6-ITdgSgw3mZzcGpg6FIqJ9qUkx_wPO6wm6NyjQpGVyxe6uZq_Tg50pRip39MCOSc7KxhRz6O8MZvMQQDIxbUYfW2ARWvDubY83OVq1wrfBmSUdhLKTj4D1hFnA-N8qOPc6jp_xFjyVCi9xTLEZ9aevWx5Pb-CLlROwQYWGIOCr1kdYYpuNgMt8J8mLjE79qUq0Z6vpAJt5w57aZr-_fOLXWXeMb6qu4gj3pgcHvDemUkWHICAOBA2ZsPLumI7TJ1IHJ6G9DiYC00thG5SiyuuJjVtYm3vVAWbuB171CA")
    // let jwt = decoded("eyJraWQiOiJZbDRZbWFoSnBZK0NLSTJlYkNOOHBReDZnVXJGbVlSTjlSU1hiSHMrQW00PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmZWQ0ZjU4OS0yMjk2LTQ4ZjgtOWIwYy0zMGYxZWFjOGQ0OGMiLCJhdWQiOiI3dWwwYnFpZGhocThqbTE1Mm82Z2prcWk1ZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6ImNmMmJiZTc1LTQ0ZTktMTFlOS1iY2UxLWIxM2NjYzcwYjI1NSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTUyNDEwNjYwLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl9pMjZhbWJLU1ciLCJuYW1lIjoiQ2hyaXN0b3BoZXIiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2hyaXN5Lmxpa2VzLnBpZUBnb29nbGVtYWlsLmNvbSIsImV4cCI6MTU1MjQxNDI2MCwiaWF0IjoxNTUyNDEwNjYwLCJlbWFpbCI6ImNocmlzeS5saWtlcy5waWVAZ29vZ2xlbWFpbC5jb20ifQ.g8vRSD2s3LpMkT1pAwSl3YTmRFBr7WIYuawZne4hY9qoQ1_iS1FGYkmE0tl7f74D3w1MnZ95Zh2shmI-GVfpcXRAxvAkJxu72K2MK8VtZN0LH0OL5CGV93dyUH63uvkmIs9XMWyIDARHKBgtVpdV9NHm05w6HI9ZksJ0eir2B34pPwPoUlJbjFlK6aT2j7L71MEewgiATnsE4s4ti_iWMSiUPYvhoE41E9Yfp6Ksb8wkROA4vnlay2OY40eLQR8doekS5wIGD7d_kAYdXI0SPIgQ-oWtAGr8Jh1c8HeW8Ox-PSJbENHfOXEEF7_uXN_hIK7-NJSBA7J0a69ONrjrEQ")
    let transaction_id = JSON_PARSED.transaction_id
    // let transaction_id = "55c3206c-ebb8-444c-91d6-f955964efbcc"

    let params = {
        TableName: "FesTransaction",

        Key: {
            "transactionId": transaction_id
        }
    }

    docClient.get(params, (err, data) => {
        if (err) {
            const response = {
                statusCode: 400,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                },
                body: JSON.stringify(err),
            };
            callback(null, response);
        }
        else {
            console.log(jwt.email)
            console.log(data.Item.reciever)
            checkIfObjectPresent(data.Item.documentUri, data)

            // checkIfResolvedAndSender(data)
        }
    });

    function checkIfResolvedAndSender(data) {
        if (data.Item.sender === jwt.email) {
            let params = {
                Bucket: "fes-filestorage",
                Key: "userDocs/" + jwt.sub + "/" + transaction_id + "/" + data.Item.documentUri,
                Expires: 600
            };
            var url = s3.getSignedUrl('getObject', params, function (err, data) {

                if (err) {
                    let response = {
                        "statusCode": 200,
                        "headers": {
                            "my_header": "my_value",
                            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                        },
                        "body": JSON.stringify(params.Key),
                        "isBase64Encoded": true
                    };
                    console.log("SENDER PATH")
                    console.log(params.Key)
                    callback(err, response);
                }

                else {
                    let response = {
                        "statusCode": 200,
                        "headers": {
                            "my_header": "my_value",
                            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                        },
                        "body": JSON.stringify(data),
                        "isBase64Encoded": true
                    };
                    callback(null, response);
                }
            });;
        }

        else if (data.Item.transactionState === "Resolved" && data.Item.reciever === jwt.email) {
            let params = {
                Bucket: "fes-filestorage",
                Key: "userDocs/" + jwt.sub + "/" + transaction_id + "/" + data.Item.documentUri,
                Expires: 600
            };
            var url = s3.getSignedUrl('getObject', params, function (err, data) {

                if (err) {
                    let response = {
                        "statusCode": 200,
                        "headers": {
                            "my_header": "my_value",
                            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                        },
                        "body": JSON.stringify(params.Key),
                        "isBase64Encoded": true
                    };
                    callback(err, response);
                }

                else {
                    let response = {
                        "statusCode": 200,
                        "headers": {
                            "my_header": "my_value",
                            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                        },
                        "body": JSON.stringify(data),
                        "isBase64Encoded": true
                    };
                    callback(null, response);
                }
            });;
        }

        else {
            let response = {
                "statusCode": 403,
                "headers": {
                    "my_header": "my_value",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                },
                "body": JSON.stringify("Not Authorized to make this request"),
                "isBase64Encoded": true
            };
            callback(null, response);
        }
    }

    function checkIfObjectPresent(document, datas) {

        var getParams = {
            Bucket: "fes-filestorage",
            Key: "userDocs/" + jwt.sub + "/" + transaction_id + "/" + datas.Item.documentUri

        }

        s3.getObject(getParams, function (err, data) {
            // Handle any error and exit
            if (err) {
                console.log(jwt)
                // console.log(err)
                // console.log(getParams)
                let response = {
                    "statusCode": 200,
                    "headers": {
                        "my_header": "my_value",
                        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                    },
                    "body": JSON.stringify(null),
                    "isBase64Encoded": true
                };
                callback(null, response);
            }
            else {
                checkIfResolvedAndSender(datas)
            }
        })
    }
};
