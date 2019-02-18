
/**
 *   
 * @author Tong Zhou b8027512@ncl.ac.uk
 * @created 12:26 18-02-2019
 */
package uk.ac.ncl.cs.csc8109.fes.client;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.inject.Named;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;


/**
 * ClientRepository 
 * 
 * 
 */
public class ClientRepository {
	@Inject
    private @Named("logger") Logger log;

    @Inject
    private EntityManager em;

    /**
     * <p>Returns a List of all persisted {@link Client} objects, sorted alphabetically by last name.</p>
     *
     * @return List of Client objects
     */
    List<Client> findAllOrderedByName() {
        TypedQuery<Client> query = em.createNamedQuery(Client.FIND_ALL, Client.class);
        return query.getResultList();
    }

    /**
     * <p>Returns a single Client object, specified by a Long id.<p/>
     *
     * @param id The id field of the Client to be returned
     * @return The Client with the specified id
     */
    Client findById(Long id) {
        return em.find(Client.class, id);
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
        TypedQuery<Client> query = em.createNamedQuery(Client.FIND_BY_EMAIL, Client.class).setParameter("email", email);
        return query.getSingleResult();
    }

    /**
     * <p>Returns a list of Client objects, specified by a String firstName.<p/>
     *
     * @param firstName The firstName field of the Clients to be returned
     * @return The Clients with the specified firstName
     */
    List<Client> findAllByFirstName(String firstName) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Client> criteria = cb.createQuery(Client.class);
        Root<Client> client = criteria.from(Client.class);
        // Swap criteria statements if you would like to try out type-safe criteria queries, a new feature in JPA 2.0.
        // criteria.select(client).where(cb.equal(client.get(Client_.firstName), firstName));
        criteria.select(client).where(cb.equal(client.get("firstName"), firstName));
        return em.createQuery(criteria).getResultList();
    }

    /**
     * <p>Returns a single Client object, specified by a String lastName.<p/>
     *
     * @param lastName The lastName field of the Clients to be returned
     * @return The Clients with the specified lastName
     */
    List<Client> findAllByLastName(String lastName) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Client> criteria = cb.createQuery(Client.class);
        Root<Client> client = criteria.from(Client.class);
        // Swap criteria statements if you would like to try out type-safe criteria queries, a new feature in JPA 2.0.
        // criteria.select(client).where(cb.equal(client.get(Client_.lastName), lastName));
        criteria.select(client).where(cb.equal(client.get("lastName"), lastName));
        return em.createQuery(criteria).getResultList();
    }

    /**
     * <p>Persists the provided Client object to the application database using the EntityManager.</p>
     *
     * <p>{@link javax.persistence.EntityManager#persist(Object) persist(Object)} takes an entity instance, adds it to the
     * context and makes that instance managed (ie future updates to the entity will be tracked)</p>
     *
     * <p>persist(Object) will set the @GeneratedValue @Id for an object.</p>
     *
     * @param client The Client object to be persisted
     * @return The Client object that has been persisted
     * @throws ConstraintViolationException, ValidationException, Exception
     */
    Client create(Client client) throws ConstraintViolationException, ValidationException, Exception {
        log.info("ClientRepository.create() - Creating " + client.getFirstName() + " " + client.getLastName());

        // Write the client to the database.
        em.persist(client);

        return client;
    }

    /**
     * <p>Updates an existing Client object in the application database with the provided Client object.</p>
     *
     * <p>{@link javax.persistence.EntityManager#merge(Object) merge(Object)} creates a new instance of your entity,
     * copies the state from the supplied entity, and makes the new copy managed. The instance you pass in will not be
     * managed (any changes you make will not be part of the transaction - unless you call merge again).</p>
     *
     * <p>merge(Object) however must have an object with the @Id already generated.</p>
     *
     * @param client The Client object to be merged with an existing Client
     * @return The Client that has been merged
     * @throws ConstraintViolationException, ValidationException, Exception
     */
    Client update(Client client) throws ConstraintViolationException, ValidationException, Exception {
        log.info("ClientRepository.update() - Updating " + client.getFirstName() + " " + client.getLastName());

        // Either update the client or add it if it can't be found.
        em.merge(client);

        return client;
    }

    /**
     * <p>Deletes the provided Client object from the application database if found there</p>
     *
     * @param client The Client object to be removed from the application database
     * @return The Client object that has been successfully removed from the application database; or null
     * @throws Exception
     */
    Client delete(Client client) throws Exception {
        log.info("ClientRepository.delete() - Deleting " + client.getFirstName() + " " + client.getLastName());

        if (client.getId() != null) {
            /*
             * The Hibernate session (aka EntityManager's persistent context) is closed and invalidated after the commit(), 
             * because it is bound to a transaction. The object goes into a detached status. If you open a new persistent 
             * context, the object isn't known as in a persistent state in this new context, so you have to merge it. 
             * 
             * Merge sees that the object has a primary key (id), so it knows it is not new and must hit the database 
             * to reattach it. 
             * 
             * Note, there is NO remove method which would just take a primary key (id) and a entity class as argument. 
             * You first need an object in a persistent state to be able to delete it.
             * 
             * Therefore we merge first and then we can remove it.
             */
            em.remove(em.merge(client));

        } else {
            log.info("ClientRepository.delete() - No ID was found so can't Delete.");
        }

        return client;
    }
}
