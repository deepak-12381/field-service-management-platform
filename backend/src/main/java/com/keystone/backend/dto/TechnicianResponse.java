package com.keystone.backend.dto;

public class TechnicianResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String skills;
    private String status;
    private Long assignedWorkOrders;

    public TechnicianResponse() {
    }

    public TechnicianResponse(Long id, String fullName, String email, String phone, String skills, String status, Long assignedWorkOrders) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.skills = skills;
        this.status = status;
        this.assignedWorkOrders = assignedWorkOrders;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getAssignedWorkOrders() { return assignedWorkOrders; }
    public void setAssignedWorkOrders(Long assignedWorkOrders) { this.assignedWorkOrders = assignedWorkOrders; }
}
