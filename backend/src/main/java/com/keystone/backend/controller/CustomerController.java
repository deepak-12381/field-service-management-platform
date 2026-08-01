 package com.keystone.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.keystone.backend.service.CustomerService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import com.keystone.backend.dto.CreateCustomerRequest;
import com.keystone.backend.dto.CustomerResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

     @Autowired
    private CustomerService customerService;


       @PostMapping
public CustomerResponse createCustomer(
        @Valid @RequestBody CreateCustomerRequest request,
        Authentication authentication) {

    String email = authentication.getName();

    return customerService.createCustomer(request, email);
}

@GetMapping
public List<CustomerResponse> getAllCustomers() {

    return customerService.getAllCustomers();

}


   @GetMapping("/{id}")
public CustomerResponse getCustomerById(@PathVariable Long id) {

     System.out.println(">>>>>>>> Controller reached with ID = " + id);

    return customerService.getCustomerById(id);
}


  @PutMapping("/{id}")
public CustomerResponse updateCustomer(
        @PathVariable Long id,
        @RequestBody CreateCustomerRequest request) {

    return customerService.updateCustomer(id, request);

}

  @DeleteMapping("/{id}")
public String deleteCustomer(@PathVariable Long id) {

    return customerService.deleteCustomer(id);

}
}