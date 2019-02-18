
/**
 *   
 * @author Tong Zhou b8027512@ncl.ac.uk
 * @created 12:39 18-02-2019
 */
package uk.ac.ncl.cs.csc8109.fes.client;

import javax.validation.ValidationException;

/**
 * UniqueEmailException 
 * 
 * 
 */
public class UniqueEmailException extends ValidationException {

    public UniqueEmailException(String message) {
        super(message);
    }

    public UniqueEmailException(String message, Throwable cause) {
        super(message, cause);
    }

    public UniqueEmailException(Throwable cause) {
        super(cause);
    }

}
