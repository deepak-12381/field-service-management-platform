package com.keystone.backend.controller;

import com.keystone.backend.dto.CreateWorkOrderPartRequest;
import com.keystone.backend.dto.WorkOrderPartResponse;
import com.keystone.backend.service.WorkOrderPartService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workorders/{workOrderId}/parts")
public class WorkOrderPartController {

    private final WorkOrderPartService partService;

    public WorkOrderPartController(WorkOrderPartService partService) {
        this.partService = partService;
    }

    @PostMapping
    public WorkOrderPartResponse addPart(@PathVariable Long workOrderId,
                                         @Valid @RequestBody CreateWorkOrderPartRequest request,
                                         Authentication authentication) {
        return partService.addPart(workOrderId, request, authentication.getName());
    }

    @GetMapping
    public List<WorkOrderPartResponse> getParts(@PathVariable Long workOrderId) {
        return partService.getPartsByWorkOrder(workOrderId);
    }

    @PutMapping("/{partId}")
    public WorkOrderPartResponse updatePart(@PathVariable Long workOrderId,
                                            @PathVariable Long partId,
                                            @Valid @RequestBody CreateWorkOrderPartRequest request) {
        return partService.updatePart(partId, request);
    }

    @DeleteMapping("/{partId}")
    public void deletePart(@PathVariable Long workOrderId, @PathVariable Long partId) {
        partService.deletePart(partId);
    }
}
