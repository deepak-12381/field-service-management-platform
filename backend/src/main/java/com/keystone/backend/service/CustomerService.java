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


@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
private UserRepository userRepository;

public CustomerResponse createCustomer(CreateCustomerRequest request) {

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

}