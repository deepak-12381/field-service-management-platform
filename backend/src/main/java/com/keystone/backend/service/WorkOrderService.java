 package com.keystone.backend.service;

import com.keystone.backend.dto.CreateWorkOrderRequest;
import com.keystone.backend.dto.UpdateWorkOrderStatusRequest;
import com.keystone.backend.dto.WorkOrderResponse;
import com.keystone.backend.entity.Site;
import com.keystone.backend.entity.WorkOrder;
import com.keystone.backend.exception.InvalidStatusTransitionException;
import com.keystone.backend.exception.ResourceNotFoundException;
import com.keystone.backend.model.WorkOrderStatus;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



@Service
public class WorkOrderService {

        private static final Logger logger =
        LoggerFactory.getLogger(WorkOrderService.class);

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

        logger.info("Creating work order: {}", request.getTitle());

    Site site = siteRepository.findById(request.getSiteId())
            .orElseThrow(() -> new  ResourceNotFoundException("Site not found"));

    String status = normalizeStatus(request.getStatus(), WorkOrderStatus.NEW.name());

    WorkOrder workOrder = new WorkOrder();
    workOrder.setTitle(request.getTitle());
    workOrder.setDescription(request.getDescription());
    workOrder.setPriority(request.getPriority().toUpperCase());
    workOrder.setStatus(status);
    workOrder.setCreatedBy(request.getCreatedBy());
    workOrder.setCreatedAt(LocalDateTime.now());
    workOrder.setSite(site);

    WorkOrder savedWorkOrder = workOrderRepository.save(workOrder);
    recordStatusHistory(savedWorkOrder, null, status, request.getCreatedBy());

    logger.info("Work order created successfully with ID: {}", savedWorkOrder.getId());

    return mapToResponse(savedWorkOrder);
}
  public List<WorkOrderResponse> getAllWorkOrders() {

    return workOrderRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}

public WorkOrderResponse getWorkOrderById(Long id) {

        logger.info("Fetching work order with ID: {}", id);

    WorkOrder workOrder = workOrderRepository.findById(id)
             .orElseThrow(() -> {
    logger.warn("Work order not found with ID: {}", id);
    return new ResourceNotFoundException("Work Order not found with ID: " + id);
});

            logger.info("Work order found with ID: {}", id);

    return mapToResponse(workOrder);
}

public WorkOrderResponse updateWorkOrder(Long id, CreateWorkOrderRequest request) {

        logger.info("Updating work order with ID: {}", id);

    WorkOrder workOrder = workOrderRepository.findById(id)
        .orElseThrow(() -> {
            logger.warn("Work order not found for update with ID: {}", id);
            return new ResourceNotFoundException("Work Order not found with ID: " + id);
        });

logger.info("Work order found for update with ID: {}", id);

    Site site = siteRepository.findById(request.getSiteId())
            .orElseThrow(() -> new  ResourceNotFoundException("Site not found"));

    workOrder.setTitle(request.getTitle());
    workOrder.setDescription(request.getDescription());
    workOrder.setPriority(request.getPriority().toUpperCase());
    workOrder.setCreatedBy(request.getCreatedBy());
    workOrder.setSite(site);

    if (request.getStatus() != null && !request.getStatus().isBlank()) {
        updateStatus(workOrder, request.getStatus(), request.getCreatedBy());
    }

    WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
    
    logger.info("Work order updated successfully with ID: {}", id);

    return mapToResponse(updatedWorkOrder);
}

public WorkOrderResponse updateWorkOrderStatus(Long id,
                                               UpdateWorkOrderStatusRequest request,
                                               String changedBy) {

    WorkOrder workOrder = workOrderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Work Order not found with ID: " + id));

    updateStatus(workOrder, request.getStatus(), changedBy);
    WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);
    return mapToResponse(updatedWorkOrder);
}


  public WorkOrderResponse assignTechnician(Long workOrderId,
                                          AssignTechnicianRequest request,
                                          String changedBy) {

    WorkOrder workOrder = workOrderRepository.findById(workOrderId)
            .orElseThrow(() -> new  ResourceNotFoundException("Work Order not found"));

    User technician = userRepository.findById(request.getTechnicianId())
            .orElseThrow(() -> new  ResourceNotFoundException("Technician not found"));

    workOrder.setTechnician(technician);

    if (WorkOrderStatus.NEW.name().equals(workOrder.getStatus())) {
        updateStatus(workOrder, WorkOrderStatus.ASSIGNED.name(), changedBy);
    }

    WorkOrder updatedWorkOrder = workOrderRepository.save(workOrder);

    return mapToResponse(updatedWorkOrder);
}

   public void deleteWorkOrder(Long id) {

    logger.info("Deleting work order with ID: {}", id);

    WorkOrder workOrder = workOrderRepository.findById(id)
            .orElseThrow(() -> {
                logger.warn("Work order not found for deletion with ID: {}", id);
                return new ResourceNotFoundException("Work Order not found with ID: " + id);
            });

    logger.info("Work order found for deletion with ID: {}", id);

    workOrderRepository.delete(workOrder);

    logger.info("Work order deleted successfully with ID: {}", id);
}
 
 public List<WorkOrderResponse> getWorkOrdersByStatus(String status) {

    return workOrderRepository.findByStatus(normalizeStatus(status, status))
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}

public List<WorkOrderResponse> getWorkOrdersByPriority(String priority) {

    return workOrderRepository.findByPriority(priority.toUpperCase())
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

private void updateStatus(WorkOrder workOrder, String newStatusValue, String changedBy) {
    String currentStatusValue = workOrder.getStatus();
    String normalizedNewStatus = normalizeStatus(newStatusValue, newStatusValue);

    if (currentStatusValue != null && currentStatusValue.equalsIgnoreCase(normalizedNewStatus)) {
        return;
    }

     WorkOrderStatus currentStatus = WorkOrderStatus.fromValue(
        currentStatusValue != null ? currentStatusValue : WorkOrderStatus.NEW.name());

WorkOrderStatus targetStatus = WorkOrderStatus.fromValue(normalizedNewStatus);

workOrder.setStatus(targetStatus.name());
recordStatusHistory(
        workOrder,
        currentStatusValue,
        targetStatus.name(),
        changedBy
);
}

private void recordStatusHistory(WorkOrder workOrder,
                                 String oldStatus,
                                 String newStatus,
                                 String changedBy) {
    WorkOrderStatusHistory history = new WorkOrderStatusHistory();
    history.setWorkOrder(workOrder);
    history.setOldStatus(oldStatus);
    history.setNewStatus(newStatus);
    history.setChangedBy(changedBy);
    history.setChangedAt(LocalDateTime.now());
    historyRepository.save(history);
}

private String normalizeStatus(String status, String defaultStatus) {
    if (status == null || status.isBlank()) {
        return defaultStatus;
    }
    return WorkOrderStatus.fromValue(status).name();
}

}