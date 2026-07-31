 package com.keystone.backend.security;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.keystone.backend.util.JwtUtil;
import com.keystone.backend.repository.UserRepository;
import com.keystone.backend.entity.User;

import java.util.Collections;
 


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    @Autowired
private JwtUtil jwtUtil;

  
 @Autowired
private UserRepository userRepository;

  @Override
protected boolean shouldNotFilter(jakarta.servlet.http.HttpServletRequest request) {

    String path = request.getServletPath();

    return path.startsWith("/api/auth/");
}

     @Override
    protected void doFilterInternal(
            jakarta.servlet.http.HttpServletRequest request,
            jakarta.servlet.http.HttpServletResponse response,
            jakarta.servlet.FilterChain filterChain)
            throws java.io.IOException, jakarta.servlet.ServletException {

                String authHeader = request.getHeader("Authorization");

                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    filterChain.doFilter(request, response);
    return;
}

        String jwt = authHeader.substring(7).trim();

        System.out.println("AUTH HEADER = " + authHeader);

        System.out.println("JWT = " + jwt);

        System.out.println("JWT LENGTH = " + jwt.length());

         String email = jwtUtil.extractEmail(jwt);

         System.out.println("EMAIL = " + email);

         User user = userRepository.findByEmail(email).orElse(null);

          if (user != null) {

    System.out.println("USER FOUND = " + user.getEmail());

    UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    Collections.emptyList());

    SecurityContextHolder.getContext().setAuthentication(authentication);

    System.out.println("AUTHENTICATION SET");
} else {
    System.out.println("USER NOT FOUND");
}

         filterChain.doFilter(request, response);

    }

}