$(document).ready(function () {
    $('#button-addon2').on('click', () => {
        generateEOR()
    })

    $('#confirmButton').on('click', ()=>{
        confirm()
    })
});

eorKey = false

function generateEOR() {

    axios({
        method: 'post',
        url: 'https://e0sjfe7hvb.execute-api.us-east-2.amazonaws.com/prod/ReturnAndSaveEOR',
        headers: {
            'x-api-key': 'aKMk5FuMXo8gA3etY97xh5SOhVSILTVb9UuHS5Wy'
        },
        data: {
            transaction_id: getAllUrlParams(window.location.href).transaction_id,
            jwt_reciever: jwtToken,
        }
    }).then((result) => {
        alert('generate success')
        document.getElementById("inputEorDom").value = result.data;
        eor = result.data
        eorKey = true
    }).catch(function (error) {
        console.log('id', getAllUrlParams(window.location.href).transaction_id)
        console.log('jwt', jwtToken)
        alert('generate error')
    })
}

function confirm() {
    if (!eorKey) {
        alert('Please generate an eoo first')
    }


    userEor = document.getElementById("inputEorDom").value
    transactionId = getAllUrlParams(window.location.href).transaction_id

    axios({
        method: 'post',
        url: 'https://e0sjfe7hvb.execute-api.us-east-2.amazonaws.com/prod/VerifyEOR',
        headers: {
            'x-api-key': 'aKMk5FuMXo8gA3etY97xh5SOhVSILTVb9UuHS5Wy'
        },
        data: {
            jwt_reciever: jwtToken,
            transaction_id: transactionId,
            signatureReciever_base64: userEor
        }
    }).then((result) => {
        console.log(result)
    }).catch(function (error) {
        console.log(error)
    })
}