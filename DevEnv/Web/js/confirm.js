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
    transactionId = getAllUrlParams(window.location.href).transaction_id
    userEor = document.getElementById("inputEorDom").value
    closeButton = $('.close')

    axios({
        method: 'post',
        url: 'https://pcjzmr67vc.execute-api.eu-west-2.amazonaws.com/Dev/transaction/checkreciever',
        headers: {
            'x-api-key': 'aKMk5FuMXo8gA3etY97xh5SOhVSILTVb9UuHS5Wy'
        },
        data: {
            jwt_reciever: jwtToken,
            transaction_id: transactionId,
        }
    }).then((result) => {
        if(result.data){
            VerifyEOR(jwtToken, transactionId, userEor)
                .then((data)=>{
                    // if (data.data){

                    // }else{
                    //     alert('receiver email not match')
                    //     closeButton.trigger('click')
                    // }
                    confirmTransaction(jwtToken, transactionId, data.data)
                        .then((res)=>{
                            console.log(res)
                        })
                        .catch((error)=>{
                            console.log(error)
                        })
                })
                .catch((err)=>{
                    console.log(err)
                })
        }else{
            closeButton.trigger('click')
            alert('receiver email not match')
        }
        
    }).catch(function (error) {
        alert('network error')
        closeButton.trigger('click')
    })

    // userEor = document.getElementById("inputEorDom").value
    // transactionId = getAllUrlParams(window.location.href).transaction_id

    // axios({
    //     method: 'post',
    //     url: 'https://e0sjfe7hvb.execute-api.us-east-2.amazonaws.com/prod/VerifyEOR',
    //     headers: {
    //         'x-api-key': 'aKMk5FuMXo8gA3etY97xh5SOhVSILTVb9UuHS5Wy'
    //     },
    //     data: {
    //         jwt_reciever: jwtToken,
    //         transaction_id: transactionId,
    //         signatureReciever_base64: userEor
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch(function (error) {s
    //     console.log(error)
    // })
}

let VerifyEOR = (jwtToken, transactionId, userEor) =>
    new Promise((resolve, reject) => {
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
            resolve(result)
        }).catch(function (error) {
            reject(error)
        })
    })

let confirmTransaction = (jwtToken, transactionId, eor_result) => {
    new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: 'https://pcjzmr67vc.execute-api.eu-west-2.amazonaws.com/Dev/transaction/confirm',
            headers: {
                'x-api-key': 'usObnKVt3F8ULNETbOMp26YAgm3bYOqh1Ahi6cfa'
            },
            data: {
                jwt: jwtToken,
                transaction_id: transactionId,
                eor_result: eor_result
            }
        }).then((result) => {
            resolve(result)
        }).catch(function (error) {
            reject(error)
        })
    }
}