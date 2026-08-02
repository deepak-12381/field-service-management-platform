 package com.keystone.backend.service;

import com.keystone.backend.repository.UserRepository;
import com.keystone.backend.repository.RoleRepository;
import com.keystone.backend.util.JwtUtil;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.junit.jupiter.api.Test;

import com.keystone.backend.dto.LoginRequest;
import com.keystone.backend.dto.RegisterRequest;
import com.keystone.backend.entity.Role;
import com.keystone.backend.entity.User;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    @Test
void testRegisterUserSuccess() {

    RegisterRequest request = new RegisterRequest();
    request.setFullName("Deepak");
    request.setEmail("deepak@gmail.com");
    request.setPassword("password123");
    request.setRole("ADMIN");

    Role role = new Role();
    role.setId(1L);
    role.setName("ADMIN");

    when(userRepository.existsByEmail("deepak@gmail.com"))
            .thenReturn(false);

    when(roleRepository.findByName("ADMIN"))
            .thenReturn(Optional.of(role));

    when(passwordEncoder.encode("password123"))
            .thenReturn("encodedPassword");

    when(userRepository.save(any(User.class)))
            .thenReturn(new User());

    String response = userService.registerUser(request);

    assertEquals("User registered successfully!", response);
}

@Test
void testRegisterUserEmailAlreadyExists() {

    RegisterRequest request = new RegisterRequest();
    request.setEmail("deepak@gmail.com");

    when(userRepository.existsByEmail("deepak@gmail.com"))
            .thenReturn(true);

    String response = userService.registerUser(request);

    assertEquals("Email already exists!", response);
}

 @Test
void testRegisterUserRoleNotFound() {

    RegisterRequest request = new RegisterRequest();
    request.setFullName("Deepak");
    request.setEmail("deepak@gmail.com");
    request.setPassword("password123");
    request.setRole("ADMIN");

    when(userRepository.existsByEmail("deepak@gmail.com"))
            .thenReturn(false);

    when(roleRepository.findByName("ADMIN"))
            .thenReturn(Optional.empty());

    String response = userService.registerUser(request);

    assertEquals("Role not found!", response);
}
@Test
void testLoginUserSuccess() {

    LoginRequest request = new LoginRequest();
    request.setEmail("deepak@gmail.com");
    request.setPassword("password123");

    Role role = new Role();
    role.setId(1L);
    role.setName("ADMIN");

    User user = new User();
    user.setId(1L);
    user.setFullName("Deepak");
    user.setEmail("deepak@gmail.com");
    user.setPassword("encodedPassword");
    user.setRole(role);

    when(userRepository.findByEmail("deepak@gmail.com"))
            .thenReturn(Optional.of(user));

    when(passwordEncoder.matches("password123", "encodedPassword"))
            .thenReturn(true);

    when(jwtUtil.generateToken("deepak@gmail.com"))
            .thenReturn("jwt-token");

    String response = userService.loginUser(request);

    assertEquals("jwt-token", response);
}
 @Test
void testLoginUserEmailNotFound() {

    LoginRequest request = new LoginRequest();
    request.setEmail("deepak@gmail.com");
    request.setPassword("password123");

    when(userRepository.findByEmail("deepak@gmail.com"))
            .thenReturn(Optional.empty());

    String response = userService.loginUser(request);

    assertEquals("Email not found!", response);
}
@Test
void testLoginUserInvalidPassword() {

    LoginRequest request = new LoginRequest();
    request.setEmail("deepak@gmail.com");
    request.setPassword("wrongPassword");

    Role role = new Role();
    role.setId(1L);
    role.setName("ADMIN");

    User user = new User();
    user.setId(1L);
    user.setFullName("Deepak");
    user.setEmail("deepak@gmail.com");
    user.setPassword("encodedPassword");
    user.setRole(role);

    when(userRepository.findByEmail("deepak@gmail.com"))
            .thenReturn(Optional.of(user));

    when(passwordEncoder.matches("wrongPassword", "encodedPassword"))
            .thenReturn(false);

    String response = userService.loginUser(request);

    assertEquals("Invalid password!", response);
}

}