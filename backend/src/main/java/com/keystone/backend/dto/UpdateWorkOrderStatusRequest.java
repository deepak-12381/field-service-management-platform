package com.keystone.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateWorkOrderStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    public UpdateWorkOrderStatusRequest() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
