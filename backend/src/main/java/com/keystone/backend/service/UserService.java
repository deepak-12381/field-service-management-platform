 package com.keystone.backend.service;

 import com.keystone.backend.dto.LoginRequest;
 import com.keystone.backend.dto.RegisterRequest;
import com.keystone.backend.entity.Role;
import com.keystone.backend.entity.User;

import java.util.Optional;
import com.keystone.backend.repository.RoleRepository;
import com.keystone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.keystone.backend.dto.LoginRequest;
import com.keystone.backend.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
 
      
     public String registerUser(RegisterRequest request) {

        logger.info("Register request received for email: {}", request.getEmail());


           
        if (userRepository.existsByEmail(request.getEmail())) {
    logger.warn("Registration failed. Email already exists: {}", request.getEmail());
    return "Email already exists!";
}

  Optional<Role> roleOptional = roleRepository.findByName(request.getRole());

    if (roleOptional.isEmpty()) {
    logger.warn("Registration failed. Role not found: {}", request.getRole());
    return "Role not found!";
}

    User user = new User();

    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(roleOptional.get());

    userRepository.save(user);

    logger.info("User registered successfully: {}", user.getEmail());
   
    return "User registered successfully!";


}
 public String loginUser(LoginRequest request) {


     logger.info("Login request received for email: {}", request.getEmail());

    Optional<User> userOptional =
        userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
    logger.warn("Login failed. Email not found: {}", request.getEmail());
    return "Email not found!";
}

        User user = userOptional.get();

        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
    logger.warn("Login failed. Invalid password for email: {}", request.getEmail());
    return "Invalid password!";
}

        String token = jwtUtil.generateToken(user.getEmail());
        logger.info("User logged in successfully: {}", user.getEmail());

        return token;
    }
}