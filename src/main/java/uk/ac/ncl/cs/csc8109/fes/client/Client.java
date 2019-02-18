
/**
 *   
 * @author Tong Zhou b8027512@ncl.ac.uk
 * @created 12:19 18-02-2019
 */
package uk.ac.ncl.cs.csc8109.fes.client;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * Client 
 * 
 * 
 */

@Entity
@NamedQueries({
        @NamedQuery(name = Client.FIND_ALL, query = "SELECT c FROM Client c ORDER BY c.lastName ASC, c.firstName ASC"),
        @NamedQuery(name = Client.FIND_BY_EMAIL, query = "SELECT c FROM Client c WHERE c.email = :email")
})
@XmlRootElement
@Table(name = "client", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class Client {
	 private static final long serialVersionUID = 1L;

	    public static final String FIND_ALL = "Client.findAll";
	    public static final String FIND_BY_EMAIL = "Client.findByEmail";
	    
	    @Id
	    @GeneratedValue(strategy = GenerationType.TABLE)
	    private Long id;

	    @NotNull
	    @Size(min = 1, max = 25)
	    @Pattern(regexp = "[A-Za-z-']+", message = "Please use a name without numbers or specials")
	    @Column(name = "first_name")
	    private String firstName;

	    @NotNull
	    @Size(min = 1, max = 25)
	    @Pattern(regexp = "[A-Za-z-']+", message = "Please use a name without numbers or specials")
	    @Column(name = "last_name")
	    private String lastName;

	    @NotNull
	    @NotEmpty
	    @Email(message = "The email address must be in the format of name@domain.com")
	    private String email;
	    
	    
	    
	    
		/** 
		 * Return the id.
		 *
		 * @return id 
		 */
		public Long getId() {
			return id;
		}

		
		/** 
		 * Set the value of id
		 *
		 * @param id: id to be set.
		 */
		public void setId(Long id) {
			this.id = id;
		}

		
		/** 
		 * Return the firstName.
		 *
		 * @return firstName 
		 */
		public String getFirstName() {
			return firstName;
		}

		
		/** 
		 * Set the value of firstName
		 *
		 * @param firstName: firstName to be set.
		 */
		public void setFirstName(String firstName) {
			this.firstName = firstName;
		}

		
		/** 
		 * Return the lastName.
		 *
		 * @return lastName 
		 */
		public String getLastName() {
			return lastName;
		}

		
		/** 
		 * Set the value of lastName
		 *
		 * @param lastName: lastName to be set.
		 */
		public void setLastName(String lastName) {
			this.lastName = lastName;
		}

		
		/** 
		 * Return the email.
		 *
		 * @return email 
		 */
		public String getEmail() {
			return email;
		}

		
		/** 
		 * Set the value of email
		 *
		 * @param email: email to be set.
		 */
		public void setEmail(String email) {
			this.email = email;
		}

		@Override
	    public boolean equals(Object o) {
	        if (this == o) return true;
	        if (!(o instanceof Client)) return false;
	        Client client = (Client) o;
	        if (!email.equals(client.email)) return false;
	        return true;
	    }

	    @Override
	    public int hashCode() {
	        return Objects.hashCode(email);
	    }
}
