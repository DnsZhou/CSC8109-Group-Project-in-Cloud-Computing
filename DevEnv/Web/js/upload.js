var loc = ''
var locKey = false
var eoo = ''
var eooKey = false
var generateEOOUrl = 'https://pcjzmr67vc.execute-api.eu-west-2.amazonaws.com/Dev/ReturnandSaveEOO'

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
    $('#inputGroupFile').change(function () {
        $(this).next('label').text($(this).val());
    })
});


function upload() {
    var fileChooser = $('#inputGroupFile')
    var receiverSelector = $('#selectEmail')
    var signedUrl = ''

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
        url: 'https://pcjzmr67vc.execute-api.eu-west-2.amazonaws.com/Dev/document/upload',
        headers: {
            'Authorization': jwtToken
        },
        data: {
            jwtToken: jwtToken,
            filename: uploadFile.name,
        }
    }).then((result) => {
        signedUrl = result.data.body;
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
            'Authorization': jwtToken
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
    closeButton = $('.close')
    if (!locKey) {
        alert('Please upload a file first')
        closeButton.trigger('click')
        return
    }

    if (!eooKey) {
        alert('Please generate an eoo first')
        closeButton.trigger('click')
        return
    }

    userEoo = document.getElementById("inputEooDom").value
    status = 'OnGoing'
    let transactionId = uuid()
    $('#docName').text(loc)
    $('#recieverName').text($('#selectEmail').val())

    axios({
        method: 'post',
        url: 'https://pcjzmr67vc.execute-api.eu-west-2.amazonaws.com/Dev/transaction/start',
        headers: {
            'Authorization': jwtToken
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
            url: 'https://pcjzmr67vc.execute-api.eu-west-2.amazonaws.com/Dev/VerifyEOO',
            headers: {
                'Authorization': jwtToken
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
                status = 'Aborted'
            }
            moveObject(transactionId, status, userEoo, $('#selectEmail').val())
                .then((data) => {
                    console.log('success', data)
                    alert('transaction success', data)
                    userEoo = ''
                    loc = ''
                    locKey = false
                    eooKey = false
                    window.location.href = './getOutbound.html'
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
                'Authorization': jwtToken
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