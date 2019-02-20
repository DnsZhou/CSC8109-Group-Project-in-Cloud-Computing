
# CSC8109 Group Project Specification

## 1 Project aims

In this project you will:

1.  gain experience working as part of a software engineering team
2.  apply what you have learnt in other modules to the development of a cloud computing application
3.  evaluate the pros and cons of services offered by a specific cloud computing provider

You will use  [Amazon Web Services (AWS)](https://aws.amazon.com/)  to develop a Trusted Third Party (TTP) fair exchange service. It is up to you to decide how you construct the service, and client, and from which of the available AWS services. Depending on  **your design decisions**, you will most likely need some combination of the following:

-   compute engine/services (examples include EC2, Elastic Beanstalk)
-   storage services (e.g. Amazon S3, EFS)
-   database services (e.g. Amazon Dynamo, RDS, Simple DB)
-   messaging services (e.g. Simple Queuing Service (SQS), Simple Notification Service (SNS))

and possibly additional services. Do  **not**  restrict your investigation of services to use to the types of service listed or to the specific examples of each type.  **You may decide to use other AWS services not listed above**  (for example, there is an Amazon Key Management Service).

To review the available services you can start from the  [Amazon Web Services (AWS) home page](https://aws.amazon.com/)  and the services on offer as part of  [Amazon's free tier](https://aws.amazon.com/free/). There is also  [listing of AWS services by category](https://aws.amazon.com/products/?nc1=f_cc)  (e.g. storage and content delivery, database, application services, security and identity).  **Take time to investigate the purpose of all products and decide on their relevance to the project**.

The free tier provides a range of services for free for a trial period and within specified usage limits. You are  **not**  restricted to free tier usage. The School will cover legitimate group project costs beyond any trial period/usage limits.

The outcome of the project will be the fair exchange service and a set of reports on your group's work. In particular, in your group report you should evaluate your service and the use of Amazon Web Services with respect to the design decisions outlined in Section 3.

## 2 Specification of the fair exchange service

For the basic fair exchange service you will use AWS to implement a Trusted Document Store (TDS). The TDS acts as an inline TTP for execution of a simplified version of the Coffey-Saidha fair exchange protocol[*](http://homepages.cs.ncl.ac.uk/nick.cook/csc8109/#coffey-saidha). The protocol allows two parties (Alice and Bob) to exchange a document for a receipt. The following figure shows the required interaction between Alice, Bob and the TDS/TTP intermediary. The result of a successful exchange is that Bob obtains Alice's document (with non-repudiation of origin) and, in return, Alice obtains Bob's non-repudiation of receipt. The fairness guarantee is that either both parties can obtain all the items they require from an exchange or neither party can. That is, Alice must only be able to obtain Bob's receipt for her document if Bob can obtain Alice's document and proof of origin (and vice versa).

![fairexchange](http://homepages.cs.ncl.ac.uk/nick.cook/csc8109/fairexchange.jpg)

To implement the protocol, the TDS will have an interface that allows clients (Alice and Bob) to perform the following actions.

-   add a document to the store (corresponding to step 1 of the protocol)
-   request an identified document (corresponding to step 2 of the protocol - note the signature over the document is returned not the document)
-   get a document (corresponding to steps 3 and 4 of the protocol - the requester provides a receipt and obtains the document in return)
-   get a receipt associated with a document (corresponding to step 5 of the protocol)

Step 4 only succeeds if Bob provided a valid receipt for Alice's document in step 3 (Bob must not be able to obtain the document before executing step 3). Step 5 only succeeds if Alice provided a valid proof of origin of her document in step 1. Steps 4 and 5 may execute simultaneously.

Note:

-   you may wish to start by ensuring you understand how to perform a basic set of interactions using AWS services before addressing the details of protocol execution,
-   you will probably have to learn to use the Java cryptography libraries (see Section 4),
-   there is no need to consider trusted timestamping in the implementation of protocols.

### Refinements and extensions

After implementing the basic system you should attempt two or more of the following refinements and extensions.

-   Secure communication between participants.
-   Add notification to the system (i) to trigger step 2 of the protocol and (ii) to trigger step 5 of the protocol.
-   Implement authorisation of actions performed by service clients.
-   Implement exchange abort, e.g. so that after step 1 Alice can send a request to abort an exchange to the TDS and the TDS will remove the document from the store and signal aborted exchange in response to any request from Bob. Note, the TDS must only abort an exchange if, at the same time, the fairness guarantee can be maintained. The protocol cannot be aborted once Alice can obtain Bob's receipt. Similarly, the protocol cannot be aborted once Bob can obtain Alice's document.
-   Implement a TTP service to support either offline or online TTP fair exchange. See  [Kremer et al's survey](http://homepages.cs.ncl.ac.uk/nick.cook/csc8109/kremer-nrsurvey-2002.pdf)  for details of such protocols.

## 3 Design decisions

The design decisions you must make and justify as a team include:

-   Which language to use for application development
-   Which of the extensions to implement
-   How clients access the TDS service - whether the service interface exposes a set of operations (e.g. using RMI, JEE, SOAP or REST) or a set of one or more message queues (e.g. using SQS). Note, the service interface includes the definition of operation parameters and/or message formats.
-   If you choose to implement the secure communication extension, whether you do this at the channel level (e.g. using SSL or HTTPS) or at the message level or both
-   If you choose to implement the notification extension, which participants are responsible for notification - e.g the TTP or the clients and what the notifications consist of (e.g. notification of availabilty of a document could replace step 2 by including the relevant non-repudiation of origin token, similarly notification of availability of a receipt could replace step 5 of the basic protocol)
-   How to structure your service, for example this can include: use of and number of SQS queues and SNS topics, where to store data, the structure of data storage, and where to perform computation (e.g. deploying the TDS management of protocol execution as a service on a local host or as a service in the cloud)

There are pros and cons to the various alternatives identified. The point here is not that there is necessarily a correct choice to make but that you should have sound technical and/or organisational reasons for making a given choice. At the end of the project you should reflect on the impact of your design decisions when evaluating the approach you have taken.

Note:

-   The above is not a comprehensive list of design choices.
-   **We will assess the extensibility and scalability of your system**. You should consider these aspects when defining messages and structuring your service.

## 4 Java cryptography libraries

Java has extensive support for cyptographic functions such as digital signatures and encryption/decryption. These are well documented as part of the  [Java Cryptography Architecture (JCA)](http://docs.oracle.com/javase/8/docs/technotes/guides/security/crypto/CryptoSpec.html). Classes you may need to use include:

-   KeyStore for representation of a (file-based) certificate and key store (for management of certificates and public/private key pairs). You can use the Java command line keytool utility to generate a keystore, keys and associated certificates.
-   Signature for generation and verification of signatures over data.
-   SignedObject for encapsulation of a signature and its associated object (data).
-   Cipher for encryption and decryption of data.
-   MessageDigest for generation and verification of secure hashes of data
-   SecureRandom for generation of secure pseudo random numbers.

In Java, data to be signed, encrypted etc. is represented as a byte[] array. So you may also find it useful to use a base64 encoder/decoder to convert between a byte[] array and a string representation of the array.

The above are just hints on the use of the JCA. You will have to use digital signatures and other other cryptographic functions in your solution. You do  **not**  have to use Java or the JCA. You can program in any language using any libraries you wish. In addition, AWS has services that provide some of the above functionality. You have to consider the trade-offs of the approach you take.

## 5 Group formation and management

The module leaders will allocate students to groups. The emphasis of the group project is team working. Therefore, it is important that group members tolerate and value each other's ideas, cooperate to work towards their common goal and evolve an effective working strategy.

Please note that the module leaders will treat groups as abstract entities, with successes or failures attributed to the group as a whole. In particular, module leaders will not get involved in "sorting out" internal disputes or in determining responsibility for work, delays, failures etc.

## 6 Deadlines and Assessment

The assessment is in two parts: the group deliverables (comprising a report on the project, a demonstration and presentation of the service) and an agreed weighting of contributions to the project.

1.  **Group deliverables.**
    -   Group presentation of the project and service developed 10:30-12:30 on Friday 15 March 2019. The presentation slides must be submitted to NESS by 08.30 at the lastest on that day.
    -   Demonstration of your working service 14:00-16:00 on Friday 15 March 2019.
    -   Group report covering the design, implementation and evaluation of your system (including consideration of design decisions such as those outlined in Section 3), an assessment of Amazon's services and the trade-offs to their use when compared, for example, to local processing and storage, and also a critical evaluation of the approach taken by other groups. Due 15:00 on Monday 18 March 2019.
2.  **Group weighting of contributions.**  Your assessment as a group of the percentage contribution of each member of the group towards the work of the group as a whole. These percentages will be used to allocate a proportion of the total mark for the group deliverables to each individual member. The group weightings must be agreed upon by the group and submitted with the group report.

Deadlines are strict. No extension is possible because the marks for CSC8109 must be available in time for the Board of Examiners to formally assess and officially grant progression for each student.

The group report contributes 90% of the group component of the module mark. The presentation contributes 10% of the group component of the module mark. The group mark will be weighted by a member's percentage contribution (Assessment 2) to get the group component of the module mark for that member.

The marking guidelines for the group reports are provided  [in a separate document](http://homepages.cs.ncl.ac.uk/nick.cook/csc8109/marking-guidelines.pdf).

There is a timetabled session to introduce the project and answer queries 10:30-12:30 on Monday 11 February 2019 in USB 2.022.

----------

*  T. Coffey and P. Saidha. Non-repudiation with mandatory proof of receipt. ACM SIGCOMM Comp. Commun. Review, Vol 26, No 1, pp. 6-17, 1996.
