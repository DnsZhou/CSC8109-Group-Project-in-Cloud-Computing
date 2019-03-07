var WildRydes = window.WildRydes || {};
var jwtToken = null;
var testStatus = "onGoing";
var testUser = "reciever";
var apigClient = apigClientFactory.newClient({
    apiKey: 'usObnKVt3F8ULNETbOMp26YAgm3bYOqh1Ahi6cfa'
});

$(document).ready(function () {
});

function hideAllComponent() {
    $(".statusResolved").addClass("hidden");
    $(".statusOnGoing").addClass("hidden");
    $(".statusAborted").addClass("hidden");
    $(".senderOnGoing").addClass("hidden");
    $(".recieverOnGoing").addClass("hidden");
    $(".senderAborted").addClass("hidden");
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
    if(testUser=="sender"){
        $(".senderOnGoing").removeClass("hidden")
        $(".recieverOnGoing").addClass("hidden")
    }
}

function testAbortedTransaction() {
    testStatus = "aborted";
    hideAllComponent();
    $(".statusAborted").removeClass("hidden")
    if(testUser=="sender"){
        $(".senderAborted").removeClass("hidden")
        $(".recieverAborted").addClass("hidden")
    }
}

function testSenderTransaction() {
    testUser = "sender";
    switch(testStatus){
        case "onGoing": testOnGoingTransaction(); break;
        case "resolved": testResolvedTransaction(); break;
        case "aborted": testAbortedTransaction(); break;
    }
}

function testrecieverTransaction() {
    testUser = "reciever";
    switch(testStatus){
        case "onGoing": testOnGoingTransaction(); break;
        case "resolved": testResolvedTransaction(); break;
        case "aborted": testAbortedTransaction(); break;
    }
}

function testGetTransactionWithId() {
    var testTransactionId = $("#testTransactionId").val()
    var body = {
        jwtToken: jwtToken,
        transactionId: testTransactionId
    };
    apigClient.transactionGettransactiondetailsPost({}, body, {})
        .then(function (result) {
            refreshCurrentTransaction(result.data)
        }).catch(function (error) {
            alert("Invalid Transaction Id, "+error)
        });
};

function refreshCurrentTransaction(transactionData){
    switch(transactionData.transactionState){
        case "OnGoing": testOnGoingTransaction(); break;
        case "Aborted": testAbortedTransaction(); break;
        case "Resolved": testResolvedTransaction(); break;
    }
    if(currentUser.username == transactionData.sender){
        testSenderTransaction();
    }else if(currentUser.username == transactionData.receiver){
        testrecieverTransaction();
    }
    $("#transactionId").text(transactionData.transactionId);
    $("#createTime").text(transactionData.createTime);
    $("#sender").text(transactionData.sender);
    $("#senderEmail").text(transactionData.sender);
    $("#senderEmail").attr("href","mailto: "+transactionData.sender);
    $("#reciever").text(transactionData.reciever);
    $("#recieverEmail").text(transactionData.reciever);
    $("#recieverEmail").attr("href","mailto: "+transactionData.reciever);
    $("#eoo").text(transactionData.eoo);
    $("#eor").text(transactionData.eor);
    $("#documnetUri").attr("href", documnetUri)
}