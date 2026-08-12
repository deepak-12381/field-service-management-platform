 package com.keystone.backend.controller;

import com.keystone.backend.dto.AssignTechnicianRequest;
import com.keystone.backend.dto.CreateWorkOrderRequest;
import com.keystone.backend.dto.UpdateWorkOrderStatusRequest;
import com.keystone.backend.dto.WorkOrderResponse;
import com.keystone.backend.service.WorkOrderService;
import org.springframework.web.bind.annotation.*;
import com.keystone.backend.dto.AssignTechnicianRequest;

import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/workorders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @PostMapping
  public WorkOrderResponse createWorkOrder(
        @Valid @RequestBody CreateWorkOrderRequest request) {

    return workOrderService.createWorkOrder(request);
}

 

@GetMapping("/{id}")
public WorkOrderResponse getWorkOrderById(@PathVariable Long id) {

    return workOrderService.getWorkOrderById(id);
}

@GetMapping("/status")
public List<WorkOrderResponse> getWorkOrdersByStatus(
        @RequestParam String status) {

    return workOrderService.getWorkOrdersByStatus(status);
}

@GetMapping("/priority")
public List<WorkOrderResponse> getWorkOrdersByPriority(
        @RequestParam String priority) {

    return workOrderService.getWorkOrdersByPriority(priority);
}

@GetMapping("/technician")
public List<WorkOrderResponse> getWorkOrdersByTechnician(
        @RequestParam Long technicianId) {

    return workOrderService.getWorkOrdersByTechnician(technicianId);
}

@GetMapping("/site")
public List<WorkOrderResponse> getWorkOrdersBySite(
        @RequestParam Long siteId) {

    return workOrderService.getWorkOrdersBySite(siteId);
}

@PutMapping("/{id}")
   public WorkOrderResponse updateWorkOrder(
        @PathVariable Long id,
        @Valid @RequestBody CreateWorkOrderRequest request) {

    return workOrderService.updateWorkOrder(id, request);
}

@PutMapping("/{workOrderId}/assign")
public WorkOrderResponse assignTechnician(
        @PathVariable Long workOrderId,
        @RequestBody AssignTechnicianRequest request,
        Authentication authentication) {

    return workOrderService.assignTechnician(workOrderId, request, authentication.getName());
}

@PutMapping("/{id}/status")
public WorkOrderResponse updateWorkOrderStatus(
        @PathVariable Long id,
        @Valid @RequestBody UpdateWorkOrderStatusRequest request,
        Authentication authentication) {

    return workOrderService.updateWorkOrderStatus(id, request, authentication.getName());
}


@DeleteMapping("/{id}")
public void deleteWorkOrder(@PathVariable Long id) {

    workOrderService.deleteWorkOrder(id);
}

@GetMapping
public Page<WorkOrderResponse> getAllWorkOrders(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String direction) {

    return workOrderService.getAllWorkOrders(page, size, sortBy, direction);
}

}