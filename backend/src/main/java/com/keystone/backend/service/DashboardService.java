 package com.keystone.backend.service;

import com.keystone.backend.dto.DashboardResponse;
import com.keystone.backend.repository.CustomerRepository;
import com.keystone.backend.repository.SiteRepository;
import com.keystone.backend.repository.UserRepository;
import com.keystone.backend.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final WorkOrderRepository workOrderRepository;

    public DashboardService(CustomerRepository customerRepository,
                            SiteRepository siteRepository,
                            UserRepository userRepository,
                            WorkOrderRepository workOrderRepository) {

        this.customerRepository = customerRepository;
        this.siteRepository = siteRepository;
        this.userRepository = userRepository;
        this.workOrderRepository = workOrderRepository;
    }

    public DashboardResponse getDashboardData() {

        DashboardResponse response = new DashboardResponse();

        response.setTotalCustomers(customerRepository.count());
        response.setTotalSites(siteRepository.count());
        response.setTotalWorkOrders(workOrderRepository.count());
        response.setTotalTechnicians(userRepository.countByRole_Name("TECHNICIAN"));

        response.setOpenWorkOrders(
                workOrderRepository.countByStatus("NEW"));

        response.setInProgressWorkOrders(
                workOrderRepository.countByStatus("IN_PROGRESS"));

        response.setCompletedWorkOrders(
                workOrderRepository.countByStatus("COMPLETED"));

        response.setHighPriorityWorkOrders(
                workOrderRepository.countByPriority("HIGH"));

        response.setAssignedWorkOrders(
                workOrderRepository.countByStatus("ASSIGNED"));

        response.setOnHoldWorkOrders(
                workOrderRepository.countByStatus("ON_HOLD"));

        response.setClosedWorkOrders(
                workOrderRepository.countByStatus("CLOSED"));

        return response;
    }
}