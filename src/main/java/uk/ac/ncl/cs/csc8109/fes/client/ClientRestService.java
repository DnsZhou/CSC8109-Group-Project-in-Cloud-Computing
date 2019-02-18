
/**
 *   
 * @author Tong Zhou b8027512@ncl.ac.uk
 * @created 12:26 18-02-2019
 */
package uk.ac.ncl.cs.csc8109.fes.client;

import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.inject.Named;
import javax.persistence.NoResultException;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.jboss.quickstarts.wfk.util.RestServiceException;
import org.jboss.resteasy.annotations.cache.Cache;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

/**
 * ClientRestService 
 * 
 * 
 */
@Path("/clients")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Api(value = "/clients", description = "Operations about clients")
@Stateless
public class ClientRestService {
	@Inject
    private @Named("logger") Logger log;
    
    @Inject
    private ClientService service;

    /**
     * <p>Return all the Clients.  They are sorted alphabetically by name.</p>
     *
     * <p>The url may optionally include query parameters specifying a Client's name</p>
     *
     * <p>Examples: <pre>GET api/clients?firstname=John</pre>, <pre>GET api/clients?firstname=John&lastname=Smith</pre></p>
     *
     * @return A Response containing a list of Clients
     */
    @GET
    @ApiOperation(value = "Fetch all Clients", notes = "Returns a JSON array of all stored Client objects.")
    public Response retrieveAllClients(@QueryParam("firstname") String firstname, @QueryParam("lastname") String lastname) {
        //Create an empty collection to contain the intersection of Clients to be returned
        List<Client> clients;

        if(firstname == null && lastname == null) {
            clients = service.findAllOrderedByName();
        } else if(lastname == null) {
                clients = service.findAllByFirstName(firstname);
        } else if(firstname == null) {
                clients = service.findAllByLastName(lastname);
        } else {
                clients = service.findAllByFirstName(firstname);
                clients.retainAll(service.findAllByLastName(lastname));
        }

        return Response.ok(clients).build();
    }
    
    /**
     * <p>Search for and return a Client identified by email address.<p/>
     *
     * <p>Path annotation includes very simple regex to differentiate between email addresses and Ids.
     * <strong>DO NOT</strong> attempt to use this regex to validate email addresses.</p>
     *
     *
     * @param email The string parameter value provided as a Client's email
     * @return A Response containing a single Client
     */
    @GET
    @Cache
    @Path("/email/{email:.+[%40|@].+}")
    @ApiOperation(
            value = "Fetch a Client by Email",
            notes = "Returns a JSON representation of the Client object with the provided email."
    )
    @ApiResponses(value = {
            @ApiResponse(code = 200, message ="Client found"),
            @ApiResponse(code = 404, message = "Client with email not found")
    })
    public Response retrieveClientsByEmail(
            @ApiParam(value = "Email of Client to be fetched", required = true)
            @PathParam("email")
            String email) {

        Client client;
        try {
            client = service.findByEmail(email);
        } catch (NoResultException e) {
            // Verify that the client exists. Return 404, if not present.
            throw new RestServiceException("No Client with the email " + email + " was found!", Response.Status.NOT_FOUND);
        }
        return Response.ok(client).build();
    }
    
    /**
     * <p>Search for and return a Client identified by id.</p>
     *
     * @param id The long parameter value provided as a Client's id
     * @return A Response containing a single Client
     */
    @GET
    @Cache
    @Path("/{id:[0-9]+}")
    @ApiOperation(
            value = "Fetch a Client by id",
            notes = "Returns a JSON representation of the Client object with the provided id."
    )
    @ApiResponses(value = {
            @ApiResponse(code = 200, message ="Client found"),
            @ApiResponse(code = 404, message = "Client with id not found")
    })
    public Response retrieveClientById(
            @ApiParam(value = "Id of Client to be fetched", allowableValues = "range[0, infinity]", required = true)
            @PathParam("id")
            long id) {

        Client client = service.findById(id);
        if (client == null) {
            // Verify that the client exists. Return 404, if not present.
            throw new RestServiceException("No Client with the id " + id + " was found!", Response.Status.NOT_FOUND);
        }
        log.info("findById " + id + ": found Client = " + client.toString());

        return Response.ok(client).build();
    }
}
