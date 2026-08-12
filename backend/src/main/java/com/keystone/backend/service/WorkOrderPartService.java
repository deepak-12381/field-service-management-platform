package com.keystone.backend.service;

import com.keystone.backend.dto.CreateWorkOrderPartRequest;
import com.keystone.backend.dto.WorkOrderPartResponse;
import com.keystone.backend.entity.WorkOrder;
import com.keystone.backend.entity.WorkOrderPart;
import com.keystone.backend.exception.ResourceNotFoundException;
import com.keystone.backend.repository.WorkOrderPartRepository;
import com.keystone.backend.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkOrderPartService {

    private final WorkOrderPartRepository partRepository;
    private final WorkOrderRepository workOrderRepository;

    public WorkOrderPartService(WorkOrderPartRepository partRepository,
                                WorkOrderRepository workOrderRepository) {
        this.partRepository = partRepository;
        this.workOrderRepository = workOrderRepository;
    }

    public WorkOrderPartResponse addPart(Long workOrderId,
                                         CreateWorkOrderPartRequest request,
                                         String createdBy) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work Order not found with ID: " + workOrderId));

        WorkOrderPart part = new WorkOrderPart();
        part.setWorkOrder(workOrder);
        part.setPartName(request.getPartName());
        part.setPartNumber(request.getPartNumber());
        part.setQuantity(request.getQuantity());
        part.setUnitCost(request.getUnitCost());
        part.setNotes(request.getNotes());
        part.setCreatedAt(LocalDateTime.now());
        part.setCreatedBy(createdBy);

        return mapToResponse(partRepository.save(part));
    }

    public List<WorkOrderPartResponse> getPartsByWorkOrder(Long workOrderId) {
        if (!workOrderRepository.existsById(workOrderId)) {
            throw new ResourceNotFoundException("Work Order not found with ID: " + workOrderId);
        }

        return partRepository.findByWorkOrderId(workOrderId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public WorkOrderPartResponse updatePart(Long partId, CreateWorkOrderPartRequest request) {
        WorkOrderPart part = partRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order part not found with ID: " + partId));

        part.setPartName(request.getPartName());
        part.setPartNumber(request.getPartNumber());
        part.setQuantity(request.getQuantity());
        part.setUnitCost(request.getUnitCost());
        part.setNotes(request.getNotes());

        return mapToResponse(partRepository.save(part));
    }

    public void deletePart(Long partId) {
        WorkOrderPart part = partRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order part not found with ID: " + partId));
        partRepository.delete(part);
    }

    private WorkOrderPartResponse mapToResponse(WorkOrderPart part) {
        WorkOrderPartResponse response = new WorkOrderPartResponse();
        response.setId(part.getId());
        response.setWorkOrderId(part.getWorkOrder().getId());
        response.setPartName(part.getPartName());
        response.setPartNumber(part.getPartNumber());
        response.setQuantity(part.getQuantity());
        response.setUnitCost(part.getUnitCost());
        response.setNotes(part.getNotes());
        response.setCreatedAt(part.getCreatedAt());
        response.setCreatedBy(part.getCreatedBy());
        return response;
    }
}
