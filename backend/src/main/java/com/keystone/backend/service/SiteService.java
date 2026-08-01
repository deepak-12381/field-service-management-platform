 package com.keystone.backend.service;

import org.springframework.stereotype.Service;

import com.keystone.backend.repository.SiteRepository;
import com.keystone.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;

import com.keystone.backend.dto.CreateSiteRequest;
import com.keystone.backend.dto.SiteResponse;
import com.keystone.backend.entity.Customer;
import com.keystone.backend.entity.Site;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;
import com.keystone.backend.exception.ResourceNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class SiteService {

    private static final Logger logger =
        LoggerFactory.getLogger(SiteService.class);


    @Autowired
private SiteRepository siteRepository;

@Autowired
private CustomerRepository customerRepository;


  
public SiteResponse createSite(CreateSiteRequest request, String createdBy) {

     logger.info("Creating site: {}", request.getSiteName());


    Optional<Customer> optionalCustomer =
        customerRepository.findById(request.getCustomerId());

        if (optionalCustomer.isPresent()) {

            Customer customer = optionalCustomer.get();

           Site site = new Site();


           site.setSiteName(request.getSiteName());
           site.setAddress(request.getAddress());
    site.setCity(request.getCity());
     site.setState(request.getState());
    site.setPincode(request.getPincode());

  site.setCreatedAt(LocalDateTime.now());
   site.setCreatedBy(createdBy);

   site.setCustomer(customer);
   siteRepository.save(site);

    logger.info("Site created successfully with ID: {}", site.getId());


   return new SiteResponse(
        site.getId(),
        site.getSiteName(),
        site.getAddress(),
        site.getCity(),
        site.getState(),
        site.getPincode(),
        customer.getCustomerName()
);



}

    throw new RuntimeException(
        "Customer not found with ID: " + request.getCustomerId()
);
}

public List<SiteResponse>  getAllSites(){

    List<Site> sites = siteRepository.findAll();

List<SiteResponse> responseList = new ArrayList<>();

for (Site site : sites) {

    responseList.add(
            new SiteResponse(
                    site.getId(),
                    site.getSiteName(),
                    site.getAddress(),
                    site.getCity(),
                    site.getState(),
                    site.getPincode(),
                    site.getCustomer().getCustomerName()
            )
    );

}
   return responseList;

}


 public SiteResponse getSiteById(Long id) {

    logger.info("Fetching site with ID: {}", id);

     Optional<Site> optionalSite = siteRepository.findById(id);

if (optionalSite.isPresent()) {

    logger.info("Site found with ID: {}", id);

    Site site = optionalSite.get();

    return new SiteResponse(
            site.getId(),
            site.getSiteName(),
            site.getAddress(),
            site.getCity(),
            site.getState(),
            site.getPincode(),
            site.getCustomer().getCustomerName()
    );
}
   
  logger.warn("Site not found with ID: {}", id);
throw new  ResourceNotFoundException("Site not found with ID: " + id);

}



 
 public SiteResponse updateSite(Long id, CreateSiteRequest request) {

     logger.info("Updating site with ID: {}", id);

     Optional<Site> optionalSite = siteRepository.findById(id);

Optional<Customer> optionalCustomer =
        customerRepository.findById(request.getCustomerId());

if (optionalSite.isPresent() && optionalCustomer.isPresent()) {

    Site site = optionalSite.get();

    logger.info("Updating site with ID: {}", id);

Customer customer = optionalCustomer.get();


site.setSiteName(request.getSiteName());
site.setAddress(request.getAddress());
site.setCity(request.getCity());
site.setState(request.getState());
site.setPincode(request.getPincode());

site.setCustomer(customer);

siteRepository.save(site);

 logger.info("Site updated successfully with ID: {}", id);

return new SiteResponse(
        site.getId(),
        site.getSiteName(),
        site.getAddress(),
        site.getCity(),
        site.getState(),
        site.getPincode(),
        site.getCustomer().getCustomerName()
);

}
  
   logger.warn("Site not found for update with ID: {}", id);
throw new  ResourceNotFoundException("Site or Customer not found.");

}

public String deleteSite(Long id) {

     logger.info("Deleting site with ID: {}", id);

     Optional<Site> optionalSite = siteRepository.findById(id);

if (optionalSite.isPresent()) {

    Site site = optionalSite.get();
     logger.info("Site found for deletion with ID: {}", id);

    siteRepository.delete(site);

    logger.info("Site deleted successfully with ID: {}", id);

    return "Site deleted successfully.";

}  
   logger.warn("Site not found for deletion with ID: {}", id);

throw new  ResourceNotFoundException("Site not found with ID: " + id);

}
}