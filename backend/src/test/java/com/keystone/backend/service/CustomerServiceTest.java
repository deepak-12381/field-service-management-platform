  package com.keystone.backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.keystone.backend.repository.CustomerRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.keystone.backend.dto.CreateCustomerRequest;
import com.keystone.backend.dto.CustomerResponse;
import com.keystone.backend.entity.Customer;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;

import com.keystone.backend.exception.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    @Test
void testCreateCustomer() {

    CreateCustomerRequest request = new CreateCustomerRequest();
    request.setCustomerName("ABC Pvt Ltd");
    request.setEmail("abc@gmail.com");
    request.setPhone("9876543210");
    request.setAddress("Anna Nagar");
    request.setCity("Chennai");
    request.setState("Tamil Nadu");
    request.setPincode("600001");

    Customer savedCustomer = new Customer();
    savedCustomer.setId(1L);
    savedCustomer.setCustomerName(request.getCustomerName());
    savedCustomer.setEmail(request.getEmail());
    savedCustomer.setPhone(request.getPhone());
    savedCustomer.setAddress(request.getAddress());
    savedCustomer.setCity(request.getCity());
    savedCustomer.setState(request.getState());
    savedCustomer.setPincode(request.getPincode());

    when(customerRepository.save(any(Customer.class))).thenReturn(savedCustomer);

     
             CustomerResponse response =
        customerService.createCustomer(request, "admin@gmail.com");

    assertEquals(1L, response.getId());
    assertEquals("ABC Pvt Ltd", response.getCustomerName());
    assertEquals("abc@gmail.com", response.getEmail());
}

  @Test
void testGetCustomerByIdSuccess() {

    Customer customer = new Customer();
    customer.setId(1L);
    customer.setCustomerName("ABC Pvt Ltd");
    customer.setEmail("abc@gmail.com");
    customer.setPhone("9876543210");
    customer.setAddress("Anna Nagar");
    customer.setCity("Chennai");
    customer.setState("Tamil Nadu");
    customer.setPincode("600001");

    when(customerRepository.findById(1L))
            .thenReturn(Optional.of(customer));

    CustomerResponse response = customerService.getCustomerById(1L);

    assertEquals(1L, response.getId());
    assertEquals("ABC Pvt Ltd", response.getCustomerName());
    assertEquals("abc@gmail.com", response.getEmail());
}

  @Test
void testGetCustomerByIdNotFound() {

    when(customerRepository.findById(100L))
            .thenReturn(Optional.empty());

    assertThrows(
            ResourceNotFoundException.class,
            () -> customerService.getCustomerById(100L)
    );
}

@Test
void testUpdateCustomerSuccess() {

    CreateCustomerRequest request = new CreateCustomerRequest();
    request.setCustomerName("Updated Customer");
    request.setEmail("updated@gmail.com");
    request.setPhone("9999999999");
    request.setAddress("Updated Address");
    request.setCity("Chennai");
    request.setState("Tamil Nadu");
    request.setPincode("600002");

    Customer customer = new Customer();
    customer.setId(1L);
    customer.setCustomerName("Old Customer");
    customer.setEmail("old@gmail.com");

    when(customerRepository.findById(1L))
            .thenReturn(Optional.of(customer));

    when(customerRepository.save(any(Customer.class)))
            .thenReturn(customer);

    CustomerResponse response =
            customerService.updateCustomer(1L, request);

    assertEquals("Updated Customer", response.getCustomerName());
    assertEquals("updated@gmail.com", response.getEmail());
    assertEquals("9999999999", response.getPhone());
}

@Test
void testDeleteCustomerSuccess() {

    Customer customer = new Customer();
    customer.setId(1L);

    when(customerRepository.findById(1L))
            .thenReturn(Optional.of(customer));

    String response = customerService.deleteCustomer(1L);

     assertEquals("Customer deleted successfully.", response);
}

}