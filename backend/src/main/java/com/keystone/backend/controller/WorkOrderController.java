 package com.keystone.backend.controller;

import com.keystone.backend.dto.AssignTechnicianRequest;
import com.keystone.backend.dto.CreateWorkOrderRequest;
import com.keystone.backend.dto.WorkOrderResponse;
import com.keystone.backend.service.WorkOrderService;
import org.springframework.web.bind.annotation.*;
import com.keystone.backend.dto.AssignTechnicianRequest;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
@RequestMapping("/api/workorders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @PostMapping
public WorkOrderResponse createWorkOrder(@RequestBody CreateWorkOrderRequest request) {

    return workOrderService.createWorkOrder(request);
}

@GetMapping
public List<WorkOrderResponse> getAllWorkOrders() {

    return workOrderService.getAllWorkOrders();
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
        @RequestBody CreateWorkOrderRequest request) {

    return workOrderService.updateWorkOrder(id, request);
}

@PutMapping("/{workOrderId}/assign")
public WorkOrderResponse assignTechnician(
        @PathVariable Long workOrderId,
        @RequestBody AssignTechnicianRequest request) {

    return workOrderService.assignTechnician(workOrderId, request);
}


@DeleteMapping("/{id}")
public void deleteWorkOrder(@PathVariable Long id) {

    workOrderService.deleteWorkOrder(id);
}

}