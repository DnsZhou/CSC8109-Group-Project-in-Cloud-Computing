
/**
 *   
 * @author Tong Zhou b8027512@ncl.ac.uk
 * @created 21:58 18-02-2019
 */
package uk.ac.ncl.cs.csc8109.fes.client;

import java.io.File;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.inject.Named;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.junit.InSequence;
import org.jboss.shrinkwrap.api.Archive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * ClientRegistrationTest
 * 
 * 
 */
@RunWith(Arquillian.class)
public class ClientRegistrationTest {
	@Deployment
	public static Archive<?> createTestArchive() {
		File[] libs = Maven.resolver().loadPomFromFile("pom.xml").resolve("io.swagger:swagger-jaxrs:1.5.15")
				.withTransitivity().asFile();

		return ShrinkWrap.create(WebArchive.class, "test.war").addPackages(true, "uk.ac.ncl.cs.csc8109.fes")
				.addPackages(true, "org.jboss.quickstarts.wfk").addAsLibraries(libs)
				.addAsResource("META-INF/test-persistence.xml", "META-INF/persistence.xml")
				.addAsWebInfResource("arquillian-ds.xml").addAsWebInfResource(EmptyAsset.INSTANCE, "beans.xml");
	}

	@Inject
	ClientRestService clientRestService;

	@Inject
	@Named("logger")
	Logger log;

	@Test
	@InSequence(1)
	public void sampleTest() throws Exception {

	}
}
