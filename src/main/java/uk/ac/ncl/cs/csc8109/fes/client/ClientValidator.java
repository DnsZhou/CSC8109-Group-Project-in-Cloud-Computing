
/**
 *   
 * @author Tong Zhou b8027512@ncl.ac.uk
 * @created 12:28 18-02-2019
 */
package uk.ac.ncl.cs.csc8109.fes.client;

import java.util.HashSet;
import java.util.Set;

import javax.inject.Inject;
import javax.persistence.NoResultException;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import javax.validation.Validator;


/**
 * ClientValidator 
 * 
 */
public class ClientValidator {
	@Inject
    private Validator validator;

    @Inject
    private ClientRepository crud;

    /**
     * <p>Validates the given Client object and throws validation exceptiCliented on the type of error. If the error is standard
     * bean validation errors then it will throw a ConstraintValidationException with the set of the constraints violated.<p/>
     *
     *
     * <p>If the error is caused because an existing client with the same email is registered it throws a regular validation
     * exception so that it can be interpreted separately.</p>
     *
     *
     * @param client The Client object to be validated
     * @throws ConstraintViolationException If Bean Validation errors exist
     * @throws ValidationException If client with the same email already exists
     */
    void validateClient(Client client) throws ConstraintViolationException, ValidationException {
        // Create a bean validator and check for issues.
        Set<ConstraintViolation<Client>> violations = validator.validate(client);

        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(new HashSet<ConstraintViolation<?>>(violations));
        }

        // Check the uniqueness of the email address
        if (emailAlreadyExists(client.getEmail(), client.getId())) {
            throw new UniqueEmailException("Unique Email Violation");
        }
    }

    /**
     * <p>Checks if a client with the same email address is already registered. This is the only way to easily capture the
     * "@UniqueConstraint(columnNames = "email")" constraint from the Client class.</p>
     *
     * <p>Since Update will being using an email that is already in the database we need to make sure that it is the email
     * from the record being updated.</p>
     *
     * @param email The email to check is unique
     * @param id The user id to check the email against if it was found
     * @return boolean which represents whether the email was found, and if so if it belongs to the user with id
     */
    boolean emailAlreadyExists(String email, Long id) {
        Client client = null;
        Client clientWithID = null;
        try {
            client = crud.findByEmail(email);
        } catch (NoResultException e) {
            // ignore
        }

        if (client != null && id != null) {
            try {
                clientWithID = crud.findById(id);
                if (clientWithID != null && clientWithID.getEmail().equals(email)) {
                    client = null;
                }
            } catch (NoResultException e) {
                // ignore
            }
        }
        return client != null;
    }
}
