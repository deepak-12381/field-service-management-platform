 package com.keystone.backend.security;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration configuration = new CorsConfiguration();

    String allowedOriginsEnv = System.getenv("ALLOWED_ORIGINS");
    if (allowedOriginsEnv != null && !allowedOriginsEnv.isBlank()) {
        configuration.setAllowedOriginPatterns(Arrays.asList(allowedOriginsEnv.split("\\s*,\\s*")));
    } else {
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:5173",
            "http://localhost:4173",
            "http://localhost:3000",
            "https://*.vercel.app"
        ));
    }
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    return source;
}

 @Bean
public AuthenticationManager authenticationManager(
        AuthenticationConfiguration configuration) throws Exception {

    return configuration.getAuthenticationManager();
}

  @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
        .cors(cors -> {})
        .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                    .requestMatchers("/api/auth/**").permitAll()

                    .requestMatchers(
                            "/swagger-ui/**",
                            "/v3/api-docs/**",
                            "/swagger-ui.html"
                    ).permitAll()

                    .requestMatchers("/api/users/profile").authenticated()

                    .requestMatchers("/api/users/**").hasAnyRole("ADMIN", "MANAGER")

                    .requestMatchers("/api/roles/**").hasAnyRole("ADMIN", "MANAGER")

                     .requestMatchers("/api/customers/**", "/api/sites/**")
    .hasAnyRole("ADMIN", "MANAGER", "DISPATCHER", "CUSTOMER", "TECHNICIAN")

                    .requestMatchers("/api/workorders/**", "/api/technicians/**", "/api/timelogs/**")
                            .hasAnyRole("ADMIN", "MANAGER", "DISPATCHER", "CUSTOMER", "TECHNICIAN")

                    .requestMatchers("/api/dashboard/**")
                            .hasAnyRole("ADMIN", "MANAGER", "DISPATCHER", "CUSTOMER", "TECHNICIAN")

                    .anyRequest().authenticated()
            )

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

    return http.build();
}

}