 package com.keystone.backend.dto;

import lombok.Data;

@Data
public class DashboardResponse {

    private long totalCustomers;
    private long totalSites;
    private long totalWorkOrders;
    private long totalTechnicians;

    private long openWorkOrders;
    private long inProgressWorkOrders;
    private long completedWorkOrders;

    private long highPriorityWorkOrders;
}