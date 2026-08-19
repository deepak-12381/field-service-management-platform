 package com.keystone.backend.security;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import com.keystone.backend.util.JwtUtil;
import com.keystone.backend.repository.UserRepository;
import com.keystone.backend.entity.User;

import java.util.List;
 


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
        try {
            String email = jwtUtil.extractEmail(jwt);
            if (email != null && !email.isBlank()) {
                User user = userRepository.findByEmail(email).orElse(null);

                if (user != null) {
                    List<SimpleGrantedAuthority> authorities = List.of();
                    if (user.getRole() != null) {
                        authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()));
                    }

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    authorities);

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            logger.warn("JWT validation failed: " + e.getMessage());
        }

        filterChain.doFilter(request, response);

    }

}