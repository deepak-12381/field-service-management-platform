 package com.keystone.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;
import com.keystone.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.keystone.backend.entity.User;
import com.keystone.backend.dto.UserProfileResponse;

@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
private UserRepository userRepository;

    @GetMapping("/profile")
  public UserProfileResponse getProfile() { 


    Authentication authentication =
        SecurityContextHolder.getContext().getAuthentication();

        User user = (User) authentication.getPrincipal();
         return new UserProfileResponse(
        user.getId(),
        user.getFullName(),
        user.getEmail(),
        user.getRole().getName()
);

}
}