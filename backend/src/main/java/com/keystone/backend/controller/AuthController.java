 package com.keystone.backend.controller;

import com.keystone.backend.dto.RegisterRequest;
import com.keystone.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String registerUser(@RequestBody RegisterRequest request) {

        return userService.registerUser(request);
    }
}