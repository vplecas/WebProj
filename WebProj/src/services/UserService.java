/**
 * 
 */
package services;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import model.Korisnici;
import model.Korisnik;
import model.Organizacija;
import model.Organizacije;
import model.enums.Uloga;
import model.kendo.UserToGetData;
import model.kendo.UserToRegister;

/** 
 * @author Veljko
 * @since 12.01.2020.
 */
@Path("/userService")
public class UserService {
	
	@POST
	@Path("/getUserOrganisationName")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	/**
	 * @param ugt - attributes are role and name
	 * @return name of users organisation
	 */
	public String getUsersOrganisationName(UserToGetData ugt) {
		Korisnici korisnici = new Korisnici();
		korisnici.setPutanja();
		korisnici.UcitajKorisnike();
		
		try {
			return korisnici.getMapaKorisnici().get(ugt.email).getOrganizacija().getIme();
		} catch (Exception e) {
			System.out.println("Neuspesno vracanje naziva organizacije admina.");
			return null;
		}
	}
	
	@POST
	@Path("/registerUser")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON) 
	/**
	 * Consumes - If a resource is unable to consume the MIME type of a client request, 
	 * the Jersey runtime sends back an HTTP �415 Unsupported Media Type� error.
	 * 
	 * @param utr
	 * @return true if user is written in
	 */
	public boolean registerUser(UserToRegister utr) {
		try {
			Korisnici korisnici = new Korisnici();
			korisnici.setPutanja();
			
			Organizacije organizacije = new Organizacije();
			organizacije.setPutanja();
			
			Organizacija organizacija = organizacije.getMapaOrganizacije().get(utr.organisationName);
			organizacije.getMapaOrganizacije().get(utr.organisationName).getListaKorisnika().add(utr.email);
			organizacije.UpisiOrganizacije();
			
			Korisnik korisnik = new Korisnik();
			korisnik.setEmail(utr.email);
			korisnik.setIme(utr.name);
			korisnik.setLozinka(utr.password);
			korisnik.setPrezime(utr.surname);
			korisnik.setUloga(Uloga.valueOf(utr.role.toUpperCase()));
			korisnik.setOrganizacija(organizacija);
			
			if (korisnici.dodajKorisnika(korisnik)) {
				korisnici.UpisiKorisnike();
				System.out.println("Korisnik je uspesno upisan");
				return true;
			} 
			return false;
		} catch (Exception e) {
			System.out.println("Something went wrong in UserService/registerUser. returnniing false.");
			return false;
		}
	}
}
