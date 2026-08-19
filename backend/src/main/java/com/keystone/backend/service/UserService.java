 package com.keystone.backend.service;

import com.keystone.backend.dto.AuthResponse;
import com.keystone.backend.dto.LoginRequest;
 import com.keystone.backend.dto.RegisterRequest;
import com.keystone.backend.dto.UpdateUserRequest;
import com.keystone.backend.dto.UserResponse;
import com.keystone.backend.entity.Role;
import com.keystone.backend.entity.User;
import com.keystone.backend.exception.BadRequestException;
import com.keystone.backend.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.keystone.backend.repository.RoleRepository;
import com.keystone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
 
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
 public AuthResponse authenticateUser(LoginRequest request) {
    logger.info("Login request received for email: {}", request.getEmail());

    Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

    if (userOptional.isEmpty()) {
        logger.warn("Login failed. Email not found: {}", request.getEmail());
        throw new BadRequestException("Email not found!");
    }

    User user = userOptional.get();

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        logger.warn("Login failed. Invalid password for email: {}", request.getEmail());
        throw new BadRequestException("Invalid password!");
    }

    String token = jwtUtil.generateToken(user.getEmail());
    logger.info("User logged in successfully: {}", user.getEmail());

    String roleName = user.getRole() != null ? user.getRole().getName() : "CUSTOMER";
    return new AuthResponse("User logged in successfully!", token, user.getEmail(), user.getFullName(), roleName);
 }

 public String loginUser(LoginRequest request) {
    AuthResponse response = authenticateUser(request);
    return response.getToken();
 }

    public Page<UserResponse> getAllUsers(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findAll(pageable).map(this::mapToResponse);
    }

    public List<UserResponse> getUsersByRole(String roleName) {
        return userRepository.findByRole_Name(roleName.toUpperCase())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return mapToResponse(user);
    }

    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setSkills(request.getSkills());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            user.setStatus(request.getStatus());
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            Role role = roleRepository.findByName(request.getRole().toUpperCase())
                    .orElseThrow(() -> new BadRequestException("Role not found: " + request.getRole()));
            user.setRole(role);
        }

        return mapToResponse(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        userRepository.delete(user);
    }

    private UserResponse mapToResponse(User user) {
        String roleName = user.getRole() != null ? user.getRole().getName() : null;
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail(), roleName);
    }

    public String resetPassword(String email, String newPassword) {

    logger.info("Password reset request received for email: {}", email);

    Optional<User> userOptional = userRepository.findByEmail(email);

    if (userOptional.isEmpty()) {
        logger.warn("Password reset failed. Email not found: {}", email);
        return "Email not found!";
    }

    User user = userOptional.get();

    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);

    logger.info("Password reset successfully for email: {}", email);

    return "Password reset successfully!";
}
}