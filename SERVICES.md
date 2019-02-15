contacts-swagger: JAX-RS Services Documentation 
=======================================================
Author: Hugo Firth

This example supports various RESTFul end points.

By default the base URL for services is `/jboss-contacts-swagger/api`.

Much more thorough documentation is available through swagger once the application is deployed, at `/jboss-contacts-swagger/`.

ContactService End Points
------------------------
##CREATE
### Create a new contact

#### /api/contacts

* Request type: POST
* Request type: JSON
* Return type: JSON
* Request example:

```JavaScript
{
    email: "jane.doe@company.com", 
    id: 14, 
    firstName: "Jane", 
    lastName: 'Doe', 
    phoneNumber: "(223) 223-1231", 
    birthDate:'1966-01-03'
}
```

* Response example:
* Success: 200 OK
* Validation error: Collection of `<field name>:<error msg>` for each error

```JavaScript
{
  "error": "Bad Request",
  "reasons": {
    "email": "That email is already used, please use a unique email"
  }
}
```


##READ
### List all contacts
#### /api/contacts

* Request type: GET
* Return type: JSON
* Response example:

```javascript
[{email: "jane.doe@company.com", id: 14, firstName: "Jane", lastName: 'Doe', phoneNumber: "(223) 223-1231", birthDate:'1966-01-03'},
 {email: "john.doe@company.com", id: 15, firstName: "John", lastName: 'Doe', phoneNumber: "(212) 555-1212", birthDate:'1978-02-23'}]
```

### Find a contact by it's ID.
#### /api/contacts/\<id>
* Request type: GET
* Return type: JSON
* Response example:

```javascript
{email: "jane.doe@company.com", id: 14, firstName: "Jane", lastName: 'Doe', phoneNumber: "(223) 223-1231", birthDate:'1966-01-03'}
```


##UPDATE
### Edit one contact
#### /api/contacts/\<id>

* Request type: PUT
* Return type: JSON
* Response example:

```javascript
{email: "jane.doe@company.com", id: 14, firstName: "Jane", lastName: 'Doe', phoneNumber: "(223) 223-1231", birthDate:'1966-01-03'}
```


##DELETE
### Delete one contact
#### /api/contacts/\<id>

* Request type: DELETE
* Return type: JSON
* Response example:
* Success: 204 No Content


