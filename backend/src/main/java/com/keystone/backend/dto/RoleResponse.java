package com.keystone.backend.dto;

public class RoleResponse {

    private Long id;
    private String name;

    public RoleResponse() {
    }

    public RoleResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
