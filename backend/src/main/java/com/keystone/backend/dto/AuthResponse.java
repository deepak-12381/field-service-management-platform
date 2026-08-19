 package com.keystone.backend.dto;

public class AuthResponse {

    private String message;
    private String token;
    private String email;
    private String fullName;
    private String role;

    public AuthResponse() {
    }

    public AuthResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }

    public AuthResponse(String message, String token, String email, String fullName, String role) {
        this.message = message;
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}