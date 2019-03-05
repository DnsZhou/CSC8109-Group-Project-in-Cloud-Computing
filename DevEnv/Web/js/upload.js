// var uploadClient = apigClientFactory.newClient({
//     apiKey: 'usObnKVt3F8ULNETbOMp26YAgm3bYOqh1Ahi6cfa'
// });

var loc = ''
var locKey = false
var eoo = ''
var eooKey = false
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
                locKey = true
                loc = uploadFile.name
            })
            .catch(function (error) {
                alert('Upload error')
            })
    })
}

function generateEOO() {
    if (!locKey) {
        alert('Please upload a file first')
        return
    }
    axios({
        method: 'post',
        url: generateEOOUrl,
        headers: {
            'x-api-key': 'aKMk5FuMXo8gA3etY97xh5SOhVSILTVb9UuHS5Wy'
        },
        data: {
            jwt: jwtToken,
            document_location: loc,
        }
    }).then((result) => {
        alert('generate success')
        document.getElementById("inputEooDom").value = result.data;
        eoo = result.data
        eooKey = true
        // s
    }).catch(function (error) {
        alert('generate error')
    })
}

function startExchange() {
    if (!locKey) {
        alert('Please upload a file first')
        return
    }

    if (!eooKey) {
        alert('Please generate an eoo first')
    }

    userEoo = document.getElementById("inputEooDom").value
    closeButton = $('.close')
    status = 'OnGoing'
    let transactionId = uuid()

    axios({
        method: 'post',
        url: 'https://pcjzmr67vc.execute-api.eu-west-2.amazonaws.com/Dev/transaction/start',
        headers: {
            'x-api-key': 'usObnKVt3F8ULNETbOMp26YAgm3bYOqh1Ahi6cfa'
        },
        data: {
            to: $('#selectEmail').val(),
            id: transactionId,
            state: status,
            jwtToken: jwtToken,
            loc: loc
        }
    }).then((result) => {
        console.log(result)
        // alert('transaction success')
        axios({
            method: 'post',
            url: 'https://e0sjfe7hvb.execute-api.us-east-2.amazonaws.com/prod/verifyEOO',
            headers: {
                'x-api-key': 'aKMk5FuMXo8gA3etY97xh5SOhVSILTVb9UuHS5Wy'
            },
            data: {
                jwt: jwtToken,
                document_location: loc,
                signature_base64: userEoo
            }
        }).then((result) => {
            console.log('success', result)
            if (result.data) {
                status = 'OnGoing'
            } else {
                status = 'Abort'
            }
            closeButton.trigger('click')
        }).catch(function (error) {
            closeButton.trigger('click')
            alert('transaction error', error)
        })
    }).catch(function (error) {
        closeButton.trigger('click')
        alert('transaction error', error)
    })




}