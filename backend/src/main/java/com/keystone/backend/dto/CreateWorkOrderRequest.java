 package com.keystone.backend.dto;
 import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateWorkOrderRequest {

     @NotBlank(message = "Title is required")
private String title;

@NotBlank(message = "Description is required")
private String description;

@NotBlank(message = "Priority is required")
private String priority;

@NotBlank(message = "Status is required")
private String status;

@NotBlank(message = "Created by is required")
private String createdBy;

@NotNull(message = "Site ID is required")
private Long siteId;

    public CreateWorkOrderRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Long getSiteId() {
        return siteId;
    }

    public void setSiteId(Long siteId) {
        this.siteId = siteId;
    }
}