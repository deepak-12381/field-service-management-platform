 package com.keystone.backend.service;

import com.keystone.backend.entity.Customer;
import com.keystone.backend.entity.Site;
import com.keystone.backend.exception.ResourceNotFoundException;
import com.keystone.backend.repository.CustomerRepository;
import com.keystone.backend.repository.SiteRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.keystone.backend.dto.CreateSiteRequest;
import com.keystone.backend.dto.SiteResponse;

import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertThrows;
import java.util.List;
import java.util.ArrayList;

@ExtendWith(MockitoExtension.class)
class SiteServiceTest {

    @Mock
    private SiteRepository siteRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private SiteService siteService;

    @Test
void testCreateSiteSuccess() {

    CreateSiteRequest request = new CreateSiteRequest();
    request.setSiteName("ABC Site");
    request.setAddress("Anna Nagar");
    request.setCity("Chennai");
    request.setState("Tamil Nadu");
    request.setPincode("600001");
    request.setCustomerId(1L);

    Customer customer = new Customer();
    customer.setId(1L);
    customer.setCustomerName("ABC Pvt Ltd");

    Site savedSite = new Site();
    savedSite.setId(1L);
    savedSite.setSiteName(request.getSiteName());
    savedSite.setAddress(request.getAddress());
    savedSite.setCity(request.getCity());
    savedSite.setState(request.getState());
    savedSite.setPincode(request.getPincode());
    savedSite.setCustomer(customer);

    when(customerRepository.findById(1L))
            .thenReturn(Optional.of(customer));

    when(siteRepository.save(any(Site.class)))
            .thenReturn(savedSite);

    SiteResponse response =
            siteService.createSite(request, "admin@gmail.com");

    assertEquals("ABC Site", response.getSiteName());
    assertEquals("ABC Pvt Ltd", response.getCustomerName());
    assertEquals("Chennai", response.getCity());
}

 @Test
void testCreateSiteCustomerNotFound() {

    CreateSiteRequest request = new CreateSiteRequest();
    request.setCustomerId(100L);

    when(customerRepository.findById(100L))
            .thenReturn(Optional.empty());

    assertThrows(
            RuntimeException.class,
            () -> siteService.createSite(request, "admin@gmail.com")
    );
}

  @Test
void testGetAllSites() {

    Customer customer = new Customer();
    customer.setId(1L);
    customer.setCustomerName("ABC Pvt Ltd");

    Site site = new Site();
    site.setId(1L);
    site.setSiteName("ABC Site");
    site.setAddress("Anna Nagar");
    site.setCity("Chennai");
    site.setState("Tamil Nadu");
    site.setPincode("600001");
    site.setCustomer(customer);

    List<Site> siteList = new ArrayList<>();
    siteList.add(site);

    when(siteRepository.findAll()).thenReturn(siteList);

    List<SiteResponse> response = siteService.getAllSites();

    assertEquals(1, response.size());
    assertEquals("ABC Site", response.get(0).getSiteName());
    assertEquals("ABC Pvt Ltd", response.get(0).getCustomerName());
}

@Test
void testGetSiteByIdSuccess() {

    Customer customer = new Customer();
    customer.setId(1L);
    customer.setCustomerName("ABC Pvt Ltd");

    Site site = new Site();
    site.setId(1L);
    site.setSiteName("ABC Site");
    site.setAddress("Anna Nagar");
    site.setCity("Chennai");
    site.setState("Tamil Nadu");
    site.setPincode("600001");
    site.setCustomer(customer);

    when(siteRepository.findById(1L))
            .thenReturn(Optional.of(site));

    SiteResponse response = siteService.getSiteById(1L);

    assertEquals(1L, response.getId());
    assertEquals("ABC Site", response.getSiteName());
    assertEquals("ABC Pvt Ltd", response.getCustomerName());
}
@Test
void testGetSiteByIdNotFound() {

    when(siteRepository.findById(100L))
            .thenReturn(Optional.empty());

    assertThrows(
            ResourceNotFoundException.class,
            () -> siteService.getSiteById(100L)
    );
}

@Test
void testUpdateSiteSuccess() {

    CreateSiteRequest request = new CreateSiteRequest();
    request.setSiteName("Updated Site");
    request.setAddress("New Address");
    request.setCity("Chennai");
    request.setState("Tamil Nadu");
    request.setPincode("600002");
    request.setCustomerId(1L);

    Customer customer = new Customer();
    customer.setId(1L);
    customer.setCustomerName("ABC Pvt Ltd");

    Site site = new Site();
    site.setId(1L);
    site.setSiteName("Old Site");

    when(siteRepository.findById(1L))
            .thenReturn(Optional.of(site));

    when(customerRepository.findById(1L))
            .thenReturn(Optional.of(customer));

    when(siteRepository.save(any(Site.class)))
            .thenReturn(site);

    SiteResponse response = siteService.updateSite(1L, request);

    assertEquals("Updated Site", response.getSiteName());
    assertEquals("ABC Pvt Ltd", response.getCustomerName());
    assertEquals("600002", response.getPincode());
}

@Test
void testUpdateSiteNotFound() {

    CreateSiteRequest request = new CreateSiteRequest();
    request.setCustomerId(1L);

    when(siteRepository.findById(100L))
            .thenReturn(Optional.empty());

    when(customerRepository.findById(1L))
            .thenReturn(Optional.of(new Customer()));

    assertThrows(
            ResourceNotFoundException.class,
            () -> siteService.updateSite(100L, request)
    );
}
 @Test
void testDeleteSiteSuccess() {

    Site site = new Site();
    site.setId(1L);

    when(siteRepository.findById(1L))
            .thenReturn(Optional.of(site));

    String response = siteService.deleteSite(1L);

    assertEquals("Site deleted successfully.", response);
}

 @Test
void testDeleteSiteNotFound() {

    when(siteRepository.findById(100L))
            .thenReturn(Optional.empty());

    assertThrows(
            ResourceNotFoundException.class,
            () -> siteService.deleteSite(100L)
    );
}
}