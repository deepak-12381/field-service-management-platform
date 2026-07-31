 package com.keystone.backend.service;

import com.keystone.backend.dto.CreateWorkOrderRequest;
import com.keystone.backend.dto.WorkOrderResponse;
import com.keystone.backend.entity.Site;
import com.keystone.backend.entity.WorkOrder;
import com.keystone.backend.repository.SiteRepository;
import com.keystone.backend.repository.WorkOrderRepository;
import com.keystone.backend.repository.WorkOrderStatusHistoryRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.keystone.backend.dto.AssignTechnicianRequest;
import com.keystone.backend.entity.User;
import com.keystone.backend.repository.UserRepository;

import com.keystone.backend.entity.WorkOrderStatusHistory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
 


@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final WorkOrderStatusHistoryRepository historyRepository;

      public WorkOrderService(
        WorkOrderRepository workOrderRepository,
        SiteRepository siteRepository,
        UserRepository userRepository,
        WorkOrderStatusHistoryRepository historyRepository) {

    this.workOrderRepository = workOrderRepository;
    this.siteRepository = siteRepository;
    this.userRepository = userRepository;
    this.historyRepository = historyRepository;
}
    public WorkOrderResponse createWorkOrder(CreateWorkOrderRequest request) {

        System.out.println("========== REQUEST ==========");
    System.out.println("Title      : " + request.getTitle());
    System.out.println("Description: " + request.getDescription());
    System.out.println("Priority   : " + request.getPriority());
    System.out.println("Status     : " + request.getStatus());
    System.out.println("CreatedBy  : " + request.getCreatedBy());
    System.out.println("SiteId     : " + request.getSiteId());


    Site site = siteRepository.findById(request.getSiteId())
            .orElseThrow(() -> new RuntimeException("Site not found"));

    WorkOrder workOrder = new WorkOrder();
    workOrder.setTitle(request.getTitle());
    workOrder.setDescription(request.getDescription());
    workOrder.setPriority(request.getPriority());
    workOrder.setStatus(request.getStatus());
    workOrder.setCreatedBy(request.getCreatedBy());
    workOrder.setCreatedAt(LocalDateTime.now());
    workOrder.setSite(site);

    WorkOrder savedWorkOrder = workOrderRepository.save(workOrder);

    return mapToResponse(savedWorkOrder);
}
  public List<WorkOrderResponse> getAllWorkOrders() {

    return workOrderRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}

public WorkOrderResponse getWorkOrderById(Long id) {

    WorkOrder workOrder = workOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Work Order not found"));

    return mapToResponse(workOrder);
}

public WorkOrderResponse updateWorkOrder(Long id, CreateWorkOrderRequest request) {

    WorkOrder workOrder = workOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Work Order not found"));

          String oldStatus = workOrder.getStatus();  

    Site site = siteRepository.findById(request.getSiteId())
            .orElseThrow(() -> new RuntimeException("Site not found"));

    workOrder.setTitle(request.getTitle());
    workOrder.setDescription(request.getDescription());
    workOrder.setPriority(request.getPriority());
    workOrder.setStatus(request.getStatus());
    workOrder.setCreatedBy(request.getCreatedBy());
    workOrder.setSite(site);

    WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);



     if (!oldStatus.equals(request.getStatus())) {

    WorkOrderStatusHistory history = new WorkOrderStatusHistory();

    history.setWorkOrder(updatedWorkOrder);
    history.setOldStatus(oldStatus);
    history.setNewStatus(request.getStatus());
    history.setChangedBy(request.getCreatedBy());
    history.setChangedAt(LocalDateTime.now());

    historyRepository.save(history);
}

    return mapToResponse(updatedWorkOrder);
}


  public WorkOrderResponse assignTechnician(Long workOrderId,
                                          AssignTechnicianRequest request) {

    WorkOrder workOrder = workOrderRepository.findById(workOrderId)
            .orElseThrow(() -> new RuntimeException("Work Order not found"));

    User technician = userRepository.findById(request.getTechnicianId())
            .orElseThrow(() -> new RuntimeException("Technician not found"));

    workOrder.setTechnician(technician);

    WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);

    return mapToResponse(updatedWorkOrder);
}

  public void deleteWorkOrder(Long id) {

    WorkOrder workOrder = workOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Work Order not found"));

    workOrderRepository.delete(workOrder);
}

 
 public List<WorkOrderResponse> getWorkOrdersByStatus(String status) {

    return workOrderRepository.findByStatus(status)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}

public List<WorkOrderResponse> getWorkOrdersByPriority(String priority) {

    return workOrderRepository.findByPriority(priority)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}

public List<WorkOrderResponse> getWorkOrdersByTechnician(Long technicianId) {

    return workOrderRepository.findByTechnician_Id(technicianId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}

public List<WorkOrderResponse> getWorkOrdersBySite(Long siteId) {

    return workOrderRepository.findBySite_Id(siteId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}
private WorkOrderResponse mapToResponse(WorkOrder workOrder) {

    WorkOrderResponse response = new WorkOrderResponse();

    response.setId(workOrder.getId());
    response.setTitle(workOrder.getTitle());
    response.setDescription(workOrder.getDescription());
    response.setPriority(workOrder.getPriority());
    response.setStatus(workOrder.getStatus());
    response.setCreatedAt(workOrder.getCreatedAt());
    response.setCreatedBy(workOrder.getCreatedBy());

    response.setSiteId(workOrder.getSite().getId());
    response.setSiteName(workOrder.getSite().getSiteName());

    if (workOrder.getTechnician() != null) {

    response.setTechnicianId(workOrder.getTechnician().getId());

    response.setTechnicianName(
            workOrder.getTechnician().getFullName());
}

    return response;
}

 public Page<WorkOrderResponse> getAllWorkOrders(int page, int size, String sortBy, String direction) {

    Sort sort = direction.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);

    return workOrderRepository.findAll(pageable)
            .map(this::mapToResponse);
}

}