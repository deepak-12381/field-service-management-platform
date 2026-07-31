 package com.keystone.backend.controller;

import com.keystone.backend.dto.WorkOrderStatusHistoryResponse;
import com.keystone.backend.service.WorkOrderStatusHistoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workorders")
public class WorkOrderStatusHistoryController {

    private final WorkOrderStatusHistoryService historyService;

    public WorkOrderStatusHistoryController(
            WorkOrderStatusHistoryService historyService) {

        this.historyService = historyService;
    }

    @GetMapping("/{workOrderId}/history")
    public List<WorkOrderStatusHistoryResponse> getHistory(
            @PathVariable Long workOrderId) {

        return historyService.getHistoryByWorkOrder(workOrderId);
    }
}