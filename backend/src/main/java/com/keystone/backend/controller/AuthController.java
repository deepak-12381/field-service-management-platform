 package com.keystone.backend.controller;

import com.keystone.backend.dto.RegisterRequest;
import com.keystone.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.keystone.backend.dto.AuthResponse;
import com.keystone.backend.dto.LoginRequest;

 @RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String registerUser(@RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public AuthResponse loginUser(@RequestBody LoginRequest request) {
        return userService.authenticateUser(request);
    }

    @PostMapping("/reset-password")
public String resetPassword(
        @RequestParam String email,
        @RequestParam String newPassword) {

    return userService.resetPassword(email, newPassword);
}
}