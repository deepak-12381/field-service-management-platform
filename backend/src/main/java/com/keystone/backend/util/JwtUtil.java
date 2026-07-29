 package com.keystone.backend.util;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
 
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "keystone_field_service_management_secret_key_2026";

    public String generateToken(String email) {

        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

       
           return Jwts.builder()
            .subject(email)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 86400000))
            .signWith(key)
            .compact();
}
   
    public String extractEmail(String token) {


        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

          return Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .getSubject();
}

}