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

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
 
      
     public String registerUser(RegisterRequest request) {


        if (userRepository.existsByEmail(request.getEmail())) {
    return "Email already exists!";
}
  Optional<Role> roleOptional = roleRepository.findByName(request.getRole());

  if (roleOptional.isEmpty()) {
    return "Role not found!";
}

    User user = new User();

    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(roleOptional.get());

    userRepository.save(user);
   
    return "User registered successfully!";


}
 public String loginUser(LoginRequest request) {

    Optional<User> userOptional =
        userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
    return "Email not found!";
}
        User user = userOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
    return "Invalid password!";
}
        return "Login Successful";
    }
}