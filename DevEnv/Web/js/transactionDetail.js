var WildRydes = window.WildRydes || {};
var jwtToken = null;
var testStatus = "onGoing";
var testUser = "reciever";
var apigClient = apigClientFactory.newClient({
    apiKey: 'usObnKVt3F8ULNETbOMp26YAgm3bYOqh1Ahi6cfa'
});

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
    var body = {
        jwtToken: jwtToken,
        transactionId: testTransactionId
    };
    apigClient.transactionGettransactiondetailsPost({}, body, {})
        .then(function (result) {

            refreshCurrentTransaction(result.data)
        }).catch(function (error) {
            alert("Invalid Transaction Id, " + error)
        });
};

function refreshCurrentTransaction(transactionData) {
    switch (transactionData.transactionState) {
        case "OnGoing": testOnGoingTransaction(); break;
        case "Aborted": testAbortedTransaction(); break;
        case "Resolved": testResolvedTransaction(); break;
    }
    if (currentUser.username == transactionData.sender) {
        testSenderTransaction();
    } else if (currentUser.username == transactionData.receiver) {
        testRecieverTransaction();
    }
    $("#transactionId").text(transactionData.transactionId);
    $("#createTime").text(transactionData.createTime);
    $("#senderEmail").text(transactionData.sender);
    $("#senderEmail").attr("href", "mailto: " + transactionData.sender);
    $("#recieverEmail").text(transactionData.reciever);
    $("#recieverEmail").attr("href", "mailto: " + transactionData.reciever);
    $("#eoo").text(transactionData.eoo);
    $("#eor").text(transactionData.eor);
    $("#documnetUri").attr("href", documnetUri)
    showPage();
}

function getTransaction() {
    testGetTransactionWithId(getAllUrlParams(window.location.href).transaction_id);
}

function showPage() {
    $("#loadingPage").addClass("hidden");
    $("#mainContent").removeClass("hidden");
}