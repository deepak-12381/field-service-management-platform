 package com.keystone.backend.dto;

import java.time.LocalDateTime;

public class WorkOrderResponse {

    private Long id;
    private String title;
    private String description;
    private String priority;
    private String status;
    private LocalDateTime createdAt;
    private String createdBy;

    private Long siteId;
    private String siteName;


    private Long technicianId;

private String technicianName;


public Long getTechnicianId() {
    return technicianId;
}

public void setTechnicianId(Long technicianId) {
    this.technicianId = technicianId;
}

public String getTechnicianName() {
    return technicianName;
}

public void setTechnicianName(String technicianName) {
    this.technicianName = technicianName;
}
    public WorkOrderResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }
}