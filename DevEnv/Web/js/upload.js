var loc = ''
var locKey = false
var eoo = ''
var eooKey = false
var generateEOOUrl = 'https://e0sjfe7hvb.execute-api.us-east-2.amazonaws.com/prod/ReturnandSaveEOO'

$(document).ready(function () {
    $('#inputGroupFileAddon04').on('click', () => {
        upload()
    })
    $('#button-addon2').on('click', () => {
        generateEOO()
    })
    $('#startTransaction').on('click', () => {
        startExchange()
    })
});


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
            if (result.data) {
                status = 'OnGoing'
            } else {
                status = 'Abort'
            }
            moveObject(transactionId, status, userEoo, $('#selectEmail').val())
                .then((data) => {
                    console.log('success', data)
                    alert('transaction success', data)
                    userEoo = ''
                    loc = ''
                    locKey = false
                    eooKey = false
                    closeButton.trigger('click')
                })
                .catch((err) => {
                    closeButton.trigger('click')
                    alert('transaction error', err)
                    console.log(3)
                })
        }).catch(function (error) {
            closeButton.trigger('click')
            alert('transaction error', error)
            console.log(1)
        })
    }).catch(function (error) {
        closeButton.trigger('click')
        alert('transaction error', error)
        console.log(2)
    })
}

let moveObject = (id, status, eoo, receiver) =>
    new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: 'https://pcjzmr67vc.execute-api.eu-west-2.amazonaws.com/Dev/document/move',
            headers: {
                'x-api-key': 'usObnKVt3F8ULNETbOMp26YAgm3bYOqh1Ahi6cfa'
            },
            data: {
                id: id,
                state: status,
                jwtToken: jwtToken,
                loc: loc,
                eoo: eoo,
            }
        }).then((result) => {
            resolve(result)
        }).catch(function (error) {
            reject(error)
        })
    })