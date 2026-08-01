 package com.keystone.backend.service;

import org.springframework.stereotype.Service;
import com.keystone.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.keystone.backend.repository.UserRepository;
import com.keystone.backend.dto.CreateCustomerRequest;
import com.keystone.backend.dto.CustomerResponse;
import com.keystone.backend.entity.Customer;
import java.time.LocalDateTime;
import com.keystone.backend.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
import com.keystone.backend.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CustomerService {

        private static final Logger logger =
        LoggerFactory.getLogger(CustomerService.class);

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
private UserRepository userRepository;

public CustomerResponse createCustomer(CreateCustomerRequest request) {

         logger.info("Creating customer: {}", request.getCustomerName());

   Customer customer = new Customer();

   customer.setCustomerName(request.getCustomerName());
customer.setEmail(request.getEmail());
customer.setPhone(request.getPhone());
customer.setAddress(request.getAddress());
customer.setCity(request.getCity());
customer.setState(request.getState());
customer.setPincode(request.getPincode());

customer.setCreatedAt(LocalDateTime.now());

Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
User user = (User) authentication.getPrincipal();

customer.setCreatedBy(user.getEmail());

customer = customerRepository.save(customer);

  logger.info("Customer created successfully with ID: {}", customer.getId());



 return new CustomerResponse(
        customer.getId(),
        customer.getCustomerName(),
        customer.getEmail(),
        customer.getPhone(),
        customer.getAddress(),
        customer.getCity(),
        customer.getState(),
        customer.getPincode()
);

}

public List<CustomerResponse> getAllCustomers() {

     List<Customer> customers = customerRepository.findAll();

        
     return customers.stream()
        .map(customer -> new CustomerResponse(
                customer.getId(),
                customer.getCustomerName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getCity(),
                customer.getState(),
                customer.getPincode()
        ))
        .collect(Collectors.toList());

}
  public CustomerResponse getCustomerById(Long id) {

        logger.info("Fetching customer with ID: {}", id);

     Optional<Customer> optionalCustomer = customerRepository.findById(id);
     
     if (optionalCustomer.isPresent()) {

        Customer customer = optionalCustomer.get();

        logger.info("Customer found with ID: {}", id);

        return new CustomerResponse(
        customer.getId(),
        customer.getCustomerName(),
        customer.getEmail(),
        customer.getPhone(),
        customer.getAddress(),
        customer.getCity(),
        customer.getState(),
        customer.getPincode()
);

}
   
logger.warn("Customer not found with ID: {}", id);
     throw new ResourceNotFoundException("Customer not found with ID: " + id);
}

public CustomerResponse updateCustomer(Long id, CreateCustomerRequest request) {

        logger.info("Updating customer with ID: {}", id);

        Optional<Customer> optionalCustomer = customerRepository.findById(id);
     


        if (optionalCustomer.isPresent()) {

                Customer customer = optionalCustomer.get();

customer.setCustomerName(request.getCustomerName());
customer.setEmail(request.getEmail());
customer.setPhone(request.getPhone());
customer.setAddress(request.getAddress());
customer.setCity(request.getCity());
customer.setState(request.getState());
customer.setPincode(request.getPincode());

customerRepository.save(customer);

  logger.info("Customer updated successfully with ID: {}", id);


  return new CustomerResponse(
                customer.getId(),
                customer.getCustomerName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getCity(),
                customer.getState(),
                customer.getPincode()
        );

}
     throw new  ResourceNotFoundException("Customer not found with ID: " + id);

}

  
  
public String deleteCustomer(Long id) {

        logger.info("Deleting customer with ID: {}", id);

        Optional<Customer> optionalCustomer = customerRepository.findById(id);

        if (optionalCustomer.isPresent()) {

                Customer customer = optionalCustomer.get();

                customerRepository.delete(customer);

                logger.info("Customer deleted successfully with ID: {}", id);

                return "Customer deleted successfully.";

}

     throw new ResourceNotFoundException("Customer not found with ID: " + id);

}

}