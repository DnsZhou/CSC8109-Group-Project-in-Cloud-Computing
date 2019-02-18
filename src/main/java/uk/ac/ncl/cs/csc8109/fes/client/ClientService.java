
/**
 *   
 * @author Tong Zhou b8027512@ncl.ac.uk
 * @created 12:27 18-02-2019
 */
package uk.ac.ncl.cs.csc8109.fes.client;

import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.inject.Named;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import javax.ws.rs.ClientErrorException;
import javax.ws.rs.core.Response;

import org.jboss.quickstarts.wfk.area.Area;
import org.jboss.quickstarts.wfk.area.AreaService;
import org.jboss.quickstarts.wfk.area.InvalidAreaCodeException;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;

/**
 * ClientService 
 * 
 * 
 */
@Dependent
public class ClientService {
	@Inject
    private @Named("logger") Logger log;

    @Inject
    private ClientValidator validator;

    @Inject
    private ClientRepository crud;

    private ResteasyClient client;
    
    /**
     * <p>Create a new client which will be used for our outgoing REST client communication</p>
     */
    public ClientService() {
        // Create client service instance to make REST requests to upstream service
        client = new ResteasyClientBuilder().build();
    }

    /**
     * <p>Returns a List of all persisted {@link Client} objects, sorted alphabetically by last name.<p/>
     *
     * @return List of Client objects
     */
    List<Client> findAllOrderedByName() {
        return crud.findAllOrderedByName();
    }

    /**
     * <p>Returns a single Client object, specified by a Long id.<p/>
     *
     * @param id The id field of the Client to be returned
     * @return The Client with the specified id
     */
    Client findById(Long id) {
        return crud.findById(id);
    }

    /**
     * <p>Returns a single Client object, specified by a String email.</p>
     *
     * <p>If there is more than one Client with the specified email, only the first encountered will be returned.<p/>
     *
     * @param email The email field of the Client to be returned
     * @return The first Client with the specified email
     */
    Client findByEmail(String email) {
        return crud.findByEmail(email);
    }

    /**
     * <p>Returns a single Client object, specified by a String firstName.<p/>
     *
     * @param firstName The firstName field of the Client to be returned
     * @return The first Client with the specified firstName
     */
    List<Client> findAllByFirstName(String firstName) {
        return crud.findAllByFirstName(firstName);
    }

    /**
     * <p>Returns a single Client object, specified by a String lastName.<p/>
     *
     * @param lastName The lastName field of the Clients to be returned
     * @return The Clients with the specified lastName
     */
    List<Client> findAllByLastName(String lastName) {
        return crud.findAllByLastName(lastName);
    }
    
    /**
     * <p>Writes the provided Client object to the application database.<p/>
     *
     * <p>Validates the data in the provided Client object using a {@link ClientValidator} object.<p/>
     *
     * @param client The Client object to be written to the database using a {@link ClientRepository} object
     * @return The Client object that has been successfully written to the application database
     * @throws ConstraintViolationException, ValidationException, Exception
     */
    Client create(Client client) throws ConstraintViolationException, ValidationException, Exception {
        log.info("ClientService.create() - Creating " + client.getFirstName() + " " + client.getLastName());
        
        // Check to make sure the data fits with the parameters in the Client model and passes validation.
        validator.validateClient(client);

        // Write the client to the database.
        return crud.create(client);
    }

    /**
     * <p>Updates an existing Client object in the application database with the provided Client object.<p/>
     *
     * <p>Validates the data in the provided Client object using a ClientValidator object.<p/>
     *
     * @param client The Client object to be passed as an update to the application database
     * @return The Client object that has been successfully updated in the application database
     * @throws ConstraintViolationException, ValidationException, Exception
     */
    Client update(Client client) throws ConstraintViolationException, ValidationException, Exception {
        log.info("ClientService.update() - Updating " + client.getFirstName() + " " + client.getLastName());
        
        // Check to make sure the data fits with the parameters in the Client model and passes validation.
        validator.validateClient(client);

        // Either update the client or add it if it can't be found.
        return crud.update(client);
    }

    /**
     * <p>Deletes the provided Client object from the application database if found there.<p/>
     *
     * @param client The Client object to be removed from the application database
     * @return The Client object that has been successfully removed from the application database; or null
     * @throws Exception
     */
    Client delete(Client client) throws Exception {
        log.info("delete() - Deleting " + client.toString());

        Client deletedClient = null;

        if (client.getId() != null) {
            deletedClient = crud.delete(client);
        } else {
            log.info("delete() - No ID was found so can't Delete.");
        }

        return deletedClient;
    }
}
