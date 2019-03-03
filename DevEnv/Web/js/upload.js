var uploadClient = apigClientFactory.newClient({
    apiKey: 'usObnKVt3F8ULNETbOMp26YAgm3bYOqh1Ahi6cfa'
});

function upload() {
    var fileChooser = $('#inputGroupFile')
    var receiverSelector = $('#selectEmail')

    if (!receiverSelector.val()) {
        notifyErr('Please choose a user')
        return
    }

    if (!fileChooser.val()) {
        notifyErr('Please choose a file')
        return
    } else {
        fileName = fileChooser.val().split('\\').pop()
    }

    console.log(fileChooser.prop('files')[0])
    uploadFile = fileChooser.prop('files')[0]

    var params = {
        // This is where any modeled request parameters should be added.
        // The key is the parameter name, as it is defined in the API in API Gateway.
        // param1: ''
    };

    var body = {
        jwtToken: jwtToken,
        filename: fileName
    };

    var additionalParams = {
        // If there are any unmodeled query parameters or headers that must be
        //   sent with the request, add them here.
        headers: {},
        queryParams: {}
    };

    apigClient.docUploadDocument(params, body, additionalParams)
        .then(function (result) {
            // Add success callback code here.
            var signedUrl = JSON.parse(result.data.body);
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
                    console.log(data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        }).catch(function (result) {
            // Add error callback code here.
        });
}

function notifyErr(msg) {
    return $.notify({
        // options
        icon: 'glyphicon glyphicon-warning-sign',
        message: msg,
    }, {
        // settings
        element: 'body',
        type: "info",
        allow_dismiss: true,
        newest_on_top: true,
        placement: {
            from: "top",
            align: "right"
        },
        offset: 60,
        delay: 5000,
        timer: 500,
        url_target: '_blank',
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        },
    });
}