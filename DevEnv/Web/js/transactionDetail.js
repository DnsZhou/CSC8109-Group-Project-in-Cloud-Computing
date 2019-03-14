var WildRydes = window.WildRydes || {};
var jwtToken = null;
var testStatus = "onGoing";
var testUser = "reciever";
var apigClient = apigClientFactory.newClient({
    apiKey: 'usObnKVt3F8ULNETbOMp26YAgm3bYOqh1Ahi6cfa'
});
var getTransactionInterval = null;
var getUrlInterval = null;

$(document).ready(function () {
    getTransaction();
});

function hideAllComponent() {
    $(".statusResolved").addClass("hidden");
    $(".statusOnGoing").addClass("hidden");
    $(".statusAborted").addClass("hidden");
    $(".senderOnGoing").addClass("hidden");
    $(".senderAborted").addClass("hidden");
    $(".recieverOnGoing").addClass("hidden");
    $(".recieverAborted").addClass("hidden");
}

function testResolvedTransaction() {
    testStatus = "resolved";
    hideAllComponent();
    $(".statusResolved").removeClass("hidden")
}

function testOnGoingTransaction() {
    testStatus = "onGoing";
    hideAllComponent();
    $(".statusOnGoing").removeClass("hidden")
    if (testUser == "sender") {
        $(".senderOnGoing").removeClass("hidden")
        $(".recieverOnGoing").addClass("hidden")
    } else {
        $(".senderOnGoing").addClass("hidden")
        $(".recieverOnGoing").removeClass("hidden")
    }
}

function testAbortedTransaction() {
    testStatus = "aborted";
    hideAllComponent();
    $(".statusAborted").removeClass("hidden")
    if (testUser == "sender") {
        $(".senderAborted").removeClass("hidden")
        $(".recieverAborted").addClass("hidden")
    } else {
        $(".senderAborted").addClass("hidden")
        $(".recieverAborted").removeClass("hidden")
    }
}

function testSenderTransaction() {
    testUser = "sender";
    switch (testStatus) {
        case "onGoing": testOnGoingTransaction(); break;
        case "resolved": testResolvedTransaction(); break;
        case "aborted": testAbortedTransaction(); break;
    }
}

function testRecieverTransaction() {
    testUser = "reciever";
    switch (testStatus) {
        case "onGoing": testOnGoingTransaction(); break;
        case "resolved": testResolvedTransaction(); break;
        case "aborted": testAbortedTransaction(); break;
    }
}

function testGetTransactionWithId(testTransactionId) {
    verifyUserLogin();
    var body = {
        jwtToken: jwtToken,
        transactionId: testTransactionId
    };
    apigClient.transactionGettransactiondetailsPost({}, body, {})
        .then(function (result) {
            if (!(!result.data.eor && result.data.transactionState == "Resolved") && !(!result.data.eoo && result.data.transactionState == "OnGoing")) {
                clearInterval(getTransactionInterval)
                refreshCurrentTransaction(result.data);
            }
        }).catch(function (error) {
            alert("Invalid Transaction Id, " + error)
        });
};

function refreshCurrentTransaction(transactionData) {
    var caseResolved = false;

    switch (transactionData.transactionState) {
        case "OnGoing": testOnGoingTransaction(); caseResolved = false; break;
        case "Aborted": testAbortedTransaction(); caseResolved = false; break;
        case "Resolved": testResolvedTransaction(); caseResolved = true; break;
    }
    if (currentUser.username == transactionData.sender) {
        getUrl(transactionData);
    } else if (currentUser.username == transactionData.reciever) {
        if (caseResolved) {
            getUrl(transactionData);
        } else {
            testRecieverTransaction();
            showPage(transactionData);
        }
    } else {
        alert("Currenr user is not authorized to view this transaction.")
    }
}

function getTransaction() {
    getTransactionInterval = setInterval(function () {
        testGetTransactionWithId(getAllUrlParams(window.location.href).transaction_id)
    }, 3000);
}

function getUrl(transactionData) {
    getUrlInterval = setInterval(function () {
        var body = {
            jwt: jwtToken,
            transaction_id: transactionData.transactionId
        };

        apigClient.retrieveURLPost({}, body, {}).then(function (docUrl) {
            if (docUrl.data) {
                transactionData.documentUrl = docUrl.data;
                testSenderTransaction();
                showPage(transactionData);
                clearInterval(getUrlInterval);
                urlLoading = false;
            }
        })
    }, 3000);
}

function showPage(transactionData) {
    $("#transactionId").text(transactionData.transactionId);
    $("#createTime").text(transactionData.createTime);
    $("#senderEmail").text(transactionData.sender);
    $("#senderEmail").attr("href", "mailto: " + transactionData.sender);
    $("#recieverEmail").text(transactionData.reciever);
    $("#recieverEmail").attr("href", "mailto: " + transactionData.reciever);
    $("#eoo").text(transactionData.eoo);
    $("#eor").text(transactionData.eor);
    $("#documnetUri").attr("href", transactionData.documentUrl)
    $("#documnetUri").attr("target", "_blank")
    $("#loadingPage").addClass("hidden");
    $("#mainContent").removeClass("hidden");
    $("#recieverName").text(transactionData.sender);
    $("#summaryRemark").text(transactionData.remark)
}
