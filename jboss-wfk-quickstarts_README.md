contacts-swagger: Documented CRUD REST API example, Swagger and JAX-RS
======================================================================
Author: Hugo Firth<br>
Level: Beginner<br>
Technologies: Swagger, REST<br>
Summary: The `contacts-swagger` quickstart demonstrates a Java EE 7 mobile database REST service using Swagger, JAX-RS,
JPA 2.1, and REST.<br>
Target Product: EAP<br>
Product Versions: EAP 7.0<br>
Source: <https://github.com/jboss-developer/jboss-wfk-quickstarts>


What is it?
-----------

The `contact-swagger` quickstart is a deployable Maven 3 project designed to help you get your foot in the door
developing REST APIs with Java EE 7 in Red Hat JBoss Enterprise Application Platform. This project is setup to allow
you to create a basic Java EE 7 service using Swagger, JAX-RS, CDI 1.0, EJB 3.2, JPA 2.1, Bean Validation 1.0 and
JUnit. It includes a persistence unit and some sample persistence and transaction code to help you get your feet wet with
database access in enterprise Java.

This service is built using a RESTful approach; i.e. clients should interact with the application server via
restful end-points (declared using JAX-RS). This application also provides vital unit tests for the contacts service.
As documentation is so important when designing APIs for use by others, we include the necessary annotations to
generate example interactive documentation using the popular [Swagger](http://swagger.io) tool.

This application focuses on **CRUD** operations against a single resource (mobile contacts). The user will have the
ability to:

* **Create** a new contact.

* **Read** a list of contacts.

* **Update** an existing contact.

* **Delete** a contact.


System requirements
-------------------

The application this project produces is designed to be run on Red Hat JBoss Enterprise Application Platform (JBoss EAP)
7.0 or later.

All you need to build this project is Java 7.0 (Java SDK 1.7) or later, and Maven 3.0 or later.

An HTML5 compatible browser such as Chrome, Safari 5+, Firefox 5+, or IE 9+ is required to view the Swagger
documentation.

With the prerequisites out of the way, you're ready to build and deploy.


Start the JBoss EAP Server
-----------------------

_This section applies to **all students**!_

#### If you are on your own machine

1. Open a command line and navigate to the root of the JBoss EAP directory.
2. The following shows the command line to start the server with the default profile:

        For Linux:   EAP_HOME/bin/standalone.sh
        For Windows: EAP_HOME\bin\standalone.bat

   Note: Adding "-b 0.0.0.0" to the above commands will allow external clients (phones, tablets, desktops, etc...)
   connect through your local network.

   For example

        For Linux:   EAP_HOME/bin/standalone.sh -b 0.0.0.0
        For Windows: EAP_HOME\bin\standalone.bat -b 0.0.0.0

#### If you are on a university machine

Start the JBoss server in the following way:

	Start -> Programming and Databases -> JBoss 7.0 - start server

This will start the JBoss server with the default profile. It will also launch a new `cmd.exe` window containing logging output from the server. You must press enter to continue to confirm configuration is stored on the H drive, and the server will start. Closing this `cmd` window will stop the server.


Build and Deploy the Quickstart
-------------------------------

_This section applies to **all students**!_

1. Make sure you have started the JBoss EAP server as described above.
2. Open a command line and navigate to the root directory of this quickstart.
3. Type this command to build and deploy the archive:

        mvn clean install wildfly:deploy

4. This compiles and packages the project into the archive `target/ROOT.war`, then deploys it to the running instance of the server.

**NOTE:** The `mvn` command, when run for the first time, will cache all the dependencies of the quickstart project on your local machine. This involves a large number of downloads and may take a number of minutes.


Access the application
----------------------

_This section applies to **all students**!_

Once you have deployed your Contacts service to your local JBoss server (following the steps above), you can access the API endpoints under the following base URL: <http://localhost:8080/api/*>.
Access the documentation of the APIs endpoints in a browser at the top-level URL: <http://localhost:8080/>.


Undeploy the Archive
--------------------

_This section applies to **all students**!_

1. Make sure you have started the JBoss EAP server as described above.
2. Open a command line and navigate to the root directory of this quickstart.
3. When you are finished testing, type this command to undeploy the archive:

        mvn wildfly:undeploy


Deploying to OpenShift
----------------------

_This section applies to **all students**!_

You can also deploy the application directly to OpenShift, Red Hat's cloud based PaaS offering, follow the instructions [here](https://github.com/NewcastleComputingScience/enterprise-middleware-coursework/blob/master/tutorial.asciidoc#openshift)


Run the Arquillian tests
------------------------

_This section applies to **all students**!_

By default, tests are configured to be skipped. The reason is that the sample test is an Arquillian test, which requires the use of a container. You can activate this test by selecting one of the container configurations provided  for JBoss.

To run the test in JBoss, first start the server. Then, execute the following `mvn` command from a `cmd.exe` window in the quickstart directoy:

    mvn clean test -Parq-wildfly-remote

This will run the test goal with the correct configuration activated.


Import the Project into an IDE
------------------------------

In most recent versions of Java development IDE's (Intellij IDEA, Eclipse), you can simply import the source from the project folder. You may have to specify that this is a Maven project, or it may determine this on its own, depending on your IDE of choice.


Debug the Application
---------------------

If you want to be able to debug into the source code or look at the Javadocs of any library in the project, you can run
either of the following two commands to pull them into your local repository. The IDE should then detect them.

    mvn dependency:sources
    mvn dependency:resolve -Dclassifier=javadoc
