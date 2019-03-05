var WildRydes = window.WildRydes || {};
var jwtToken = null;
var testStatus = "onGoing";
var testUser = "reciver";
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
    $(".reciverOnGoing").addClass("hidden");
    $(".senderAborted").addClass("hidden");
    $(".reciverAborted").addClass("hidden");
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
        $(".reciverOnGoing").addClass("hidden")
    }
}

function testAbortedTransaction() {
    testStatus = "aborted";
    hideAllComponent();
    $(".statusAborted").removeClass("hidden")
    if(testUser=="sender"){
        $(".senderAborted").removeClass("hidden")
        $(".reciverAborted").addClass("hidden")
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

function testReciverTransaction() {
    testUser = "reciver";
    switch(testStatus){
        case "onGoing": testOnGoingTransaction(); break;
        case "resolved": testResolvedTransaction(); break;
        case "aborted": testAbortedTransaction(); break;
    }
}