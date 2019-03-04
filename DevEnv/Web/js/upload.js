// var uploadClient = apigClientFactory.newClient({
//     apiKey: 'usObnKVt3F8ULNETbOMp26YAgm3bYOqh1Ahi6cfa'
// });

var loc = ''
var eoo = ''
var generateEOOUrl = 'https://e0sjfe7hvb.execute-api.us-east-2.amazonaws.com/prod/ReturnandSaveEOO'


function upload() {
    var fileChooser = $('#inputGroupFile')
    var receiverSelector = $('#selectEmail')

    if (!receiverSelector.val()) {
        alert('Please choose a user')
        return
    }

    if (!fileChooser.val()) {
        alert('Please choose a file')
        return
    }

    console.log(fileChooser.prop('files')[0])
    uploadFile = fileChooser.prop('files')[0]

    var params = {
        // This is where any modeled request parameters should be added.
        // The key is the parameter name, as it is defined in the API in API Gateway.
        // param1: ''
    };

    // var body = {
    //     jwtToken: jwtToken,
    //     filename: fileName
    // };

    var additionalParams = {
        // If there are any unmodeled query parameters or headers that must be
        //   sent with the request, add them here.
        headers: {},
        queryParams: {}
    };

    axios({
        method: 'post',
        url: 'https://qnjstbq3od.execute-api.us-east-2.amazonaws.com/one/stepone',
        headers: {
            'x-api-key': 'bkDIzz0lVX9nukr7qf7sM6yPe2C1oNnracaDMspW'
        },
        data: {
            jwtToken: jwtToken,
            filename: uploadFile.name,
        }
    }).then((result) => {
        var signedUrl = result.data;
        signedUrl = signedUrl.url
        console.log(signedUrl)

        var options = {
            headers: {
                'Content-Type': uploadFile.type,
                "my_header": "my_value",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Max-Age": 36000,
                "Access-Control-Allow-Credentials": true
            }
        };
        axios.put(signedUrl, uploadFile, options)
            .then((data) => {
                alert('Upload success')
                console.log(data)
                loc = data.config.url
            })
            .catch(function (error) {
                console.log(error)
            })
    })
    // apigClient.docUploadDocument(params, body, additionalParams)
    //     .then(function (result) {
    //         // Add success callback code here.
    //         var signedUrl = JSON.parse(result.data.body);
    //         signedUrl = signedUrl.url
    //         console.log(signedUrl)

    //         var options = {
    //             headers: {
    //                 'Content-Type': uploadFile.type,
    //                 "my_header": "my_value",
    //                 "Access-Control-Allow-Origin": "*",
    //                 "Access-Control-Max-Age": 36000,
    //                 "Access-Control-Allow-Credentials": true
    //             }
    //         };
    //         axios.put(signedUrl, uploadFile, options)
    //             .then((data) => {
    //                 console.log(data)
    //             })
    //             .catch(function (error) {
    //                 console.log(error)
    //             })
    //     }).catch(function (result) {
    //         // Add error callback code here.
    //     });
}

function generateEOO() {
    if (!loc) {
        alert('Please upload a file first')
        return
    }

    let inputDom = $('#inputEooDom')

    axios({
        method: 'post',
        url: generateEOOUrl,
        headers: {
            'x-api-key': 'aKMk5FuMXo8gA3etY97xh5SOhVSILTVb9UuHS5Wy'
        },
        data: {
            jwtToken: jwtToken,
            document_location: loc,
        }
    }).then((result) => {
        console.log(result)
        eoo = result.data.eoo
    }).catch(function (error) {
        alert(error)
    })
}

function startExchange() {
    if (!loc) {
        alert('Please upload a file first')
        return
    }

    if (!eoo) {
        alert('Please generate an eoo first')
    }

    let uuid = uuid()

    axios({
        method: 'post',
        url: uploadTransUrl,
        headers: {
            'x-api-key': 'Lz80XHUD0N64C5J5BLvUA9ayad1pBQ7Z7iw19PnR'
        },
        data: {
            from: fromSelect.options[fromIndex].value,
            to: toSelect.options[toIndex].value,
            loc: loc,
            id: uuid,
            eoo: ''
        }
    }).then((result) => {
        alert('Success')

    }).catch(function (error) {
        alert(error)
    })



}