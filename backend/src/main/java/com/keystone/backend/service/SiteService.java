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

@Service
public class SiteService {


    @Autowired
private SiteRepository siteRepository;

@Autowired
private CustomerRepository customerRepository;


  
public SiteResponse createSite(CreateSiteRequest request, String createdBy) {


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

public List<SiteResponse> getAllSites() {

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

     Optional<Site> optionalSite = siteRepository.findById(id);

if (optionalSite.isPresent()) {

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

throw new RuntimeException("Site not found with ID: " + id);

}



 
 public SiteResponse updateSite(Long id, CreateSiteRequest request) {

     Optional<Site> optionalSite = siteRepository.findById(id);

Optional<Customer> optionalCustomer =
        customerRepository.findById(request.getCustomerId());

if (optionalSite.isPresent() && optionalCustomer.isPresent()) {

    Site site = optionalSite.get();

Customer customer = optionalCustomer.get();


site.setSiteName(request.getSiteName());
site.setAddress(request.getAddress());
site.setCity(request.getCity());
site.setState(request.getState());
site.setPincode(request.getPincode());

site.setCustomer(customer);

siteRepository.save(site);

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

throw new RuntimeException("Site or Customer not found.");

}

public String deleteSite(Long id) {

     Optional<Site> optionalSite = siteRepository.findById(id);

if (optionalSite.isPresent()) {

    Site site = optionalSite.get();

    siteRepository.delete(site);

    return "Site deleted successfully.";

}

throw new RuntimeException("Site not found with ID: " + id);

}
}