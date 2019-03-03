# Backend API function List

## 1.uploadDocument
- #### input: 
    - jwt
    - document
- #### process:
    - get sub from jwt
    - find the folder in S3 which named with sub, create it if not exists
    - save document to the folder
- #### return:
    - the location url of the document

## 2.generateEooSignature
- #### input: 
    - jwt
    - the location url of the document
- #### process:
    - get sub from jwt
        - **if url of file does not match the sub in jwt**, reject the request
    - get the private key from the s3 folder(at the same folder named with sub)
    - generate the signature of the document with private key, encode it with base64.
- #### return:
    - the signature of the document in BASE64 format
    
## 3.generateEorSignature
- #### input: 
    - jwt
    - TransactionId
- #### process:
    - get sub from jwt
    - get the private key from the s3 folder(at the same folder named with sub)
    - generate the EOR signature of the EOO with private key, encode it with base64.
- #### return:
    - the signature of the EOO (AKA EOR)

## 4.creatTransaction
- #### input: 
    - jwt
    - the location url of the document
    - the signature of the document(EOO) 
    - reciever's email
- #### process:
    - decode the EOO with base64
    - get sub from *jwt*
    - get sender's *email* from *jwt*
    - create a transaction in DynamalDB, with following information:
        - transactionId: generated UUID 
        - sender: email of the sender(from jwt)
        - reciever: email of the reciever
        - status: OnGoing
        - state: 2
        - eoo: EOO that passed in
        - eor: empty
        - documentUri: the location of the document
        - remark - use the message mention above
        - createTime - use current time
    - if transaction created: 
        - Update the user table with sender *email*, add the transaction to *outboundTransactions* list.
        - Update the user table with reciever *email*, add the transaction to *inboundTransactions* list.
    - call "**12. verifySignature**" function, pass in *jwt*, *transactionId* to it.
        - **if return true** update the transaction and mark the status as OnGoing
        - **if return false** update the transaction and mark the status as Aborted add add message to remark field: *EOO Signature not match with the Original Document*
- #### return:
    - whether transaction created successfully or not

## 5.confirmTransaction
- #### input: 
    - jwt
    - transactionId
    - the signature of EOO (AKA EOR)
- #### process:
    - decode the EOR with base64
    - get *sub* from *jwt*
    - get *Transaction* from DynamalDB by the *transactionId* that passed in
    - validate whether the *email* of the current user in jwt match with the reciever's email in the transaction
    - validate whether the *EOR* match with the *EOO* from the Transaction in DB, 
        - **if not**, mark the transaction as **Aborted**, add message to remark field: **
    - generate the signature of the document
    - update a transaction in DynamalDB with *transactionId* provided, use following information:
        - state: 4
        - eor: EOR that passed in
        - updateTime - Current time
    - call "**12. verifySignature**" function, pass in *jwt*, *transactionId* to it.
        - **if return true** update the transaction and mark the status as OnGoing
        - **if return false** update the transaction and mark the status as Aborted add add message to remark field: *EOR* Signature not match with the *EOO* Signature
- #### return:
    - whether transaction confirmed successfully or not

## 6.getAllUsers
get all users other than current user in jwt
- #### input: 
    - jwt
- #### process:
    - ~~validate where there is a jwt and the user email in jwt exist in User Table~~
    - query the database and get list of all users in {email: "email", fullName: "fullName"} format
- #### return:
    - list of users.

## 7.getMyInboundTransactionList
- #### input: 
    - jwt
- #### process:
    - get user *email* from jwt
    - use the *email* to find *InboundTransactions* (a list of uuids) of this user
    - get list of **transactions** from *InboundTransactions*, construct in following format:
        - transactionId
        - sender
        - reciver
        - status
        - state
        - createTime
        - updateTime
- #### return:
    - list of **transactions**

## 8.getMyUnreadInboundTransactionList
This function aimed to provide a message for user to find all unfinished process and show as messages in homepage.
- #### input: 
    - jwt
- #### process:
    - get user *email* from jwt
    - use the *email* to find the InboundTransactions (a list of uuids) of this user
    - get list of **transactions** from the InboundTransactions, which has a status of **onGoing** construct in following format:
        - transactionId
        - sender
        - reciver
        - status
        - state
        - createTime
        - updateTime
- #### return:
    - list of **transactions**

## 9.getMyOutboundTransactionList
- #### input: 
    - jwt
- #### process:
    - get user *email* from jwt
    - use the *email* to find the *OutboundTransactions* (a list of uuids) of this user
    - get list of **transactions** from the InboundTransactions, construct in following format:
        - transactionId
        - sender
        - reciver
        - status
        - state
        - createTime
        - updateTime
    - query the database and get list of all users in {email: "email", fullName: "fullName"} format
- #### return:
    - list of **transactions**

## 10.getTransactionDetails
- #### input: 
    - jwt
    - transactionId
- #### process:
    - get user *email* from jwt
    - get *transaction* from DB with transactionId
    - verify the *email*,
        - **if (*email* == transaction.sender):**
            - construct transaction json object with full information
        - **else if (*email* == transaction.reciver:**)
            - **if (*transaction*.status == Resolved**)
                - construct transaction json object with full information
            - **else if (*transaction*.status != Resolved**)
                -  construct transaction json object as following:
                    - transactionId
                    - Sender
                    - Reciever
                    - Status
                    - State
                    - EOO
                    - EOR (can be empty if reciver have not confirm the transaction)
                    - CreateTime
                    - UpdateTime
                    - Remark
        - **else**: return error message "Current user is not authorized to view this transaction"
- #### return:
    - json object *transaction* or error message

## 11.register
this function will be executed automatically after the user registered
- #### input: 
    - jwt(from cognito)
- #### process:
    - get *email*, *fullName* from *jwt*
    - generate a new *private key* and *public key* and save it to the folder named with the *sub* in *jwt*.
    - create a new user in DB with following information:
        - email - String
        - sub - String, the uuid provided by Cognito to identify a single user
        - fullName - String
    - query the database and get list of all users in {email: "email", fullName: "fullName"} format
- #### return:
    - list of **transactions**

## 12.verifySignature
this function is designed to validate whether EOO or EOR match the transaction.
- #### input: 
    - jwt
    - transactionId
- #### process:
    - find *transaction* in DB with *transactionId*
    - **if EOR == null**
        - validate whether EOO match with the document
    - **if EOR != null**
        - validate whether EOR match with the EOO
- #### return:
    - the result of validation(true or false)
