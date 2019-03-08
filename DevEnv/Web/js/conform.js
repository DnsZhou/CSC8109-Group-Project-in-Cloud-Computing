function generateEOR() {
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
            transaction_id: transaction_id,
            jwt_sender:,
            jwt_reciever: jwtToken,
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