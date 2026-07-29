 package com.keystone.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.keystone.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import com.keystone.backend.dto.CreateCustomerRequest;
import com.keystone.backend.dto.CustomerResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

     @Autowired
    private CustomerService customerService;


    @PostMapping
public CustomerResponse createCustomer(@RequestBody CreateCustomerRequest request) {

    return customerService.createCustomer(request);

}

@GetMapping
public List<CustomerResponse> getAllCustomers() {

    return customerService.getAllCustomers();

}
}