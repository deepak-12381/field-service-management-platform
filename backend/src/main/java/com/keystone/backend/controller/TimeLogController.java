package com.keystone.backend.controller;

import com.keystone.backend.dto.CreateTimeLogRequest;
import com.keystone.backend.dto.TimeLogResponse;
import com.keystone.backend.service.TimeLogService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TimeLogController {

    private final TimeLogService timeLogService;

    public TimeLogController(TimeLogService timeLogService) {
        this.timeLogService = timeLogService;
    }

    @PostMapping("/workorders/{workOrderId}/timelogs")
    public TimeLogResponse createTimeLog(@PathVariable Long workOrderId,
                                           @Valid @RequestBody CreateTimeLogRequest request) {
        return timeLogService.createTimeLog(workOrderId, request);
    }

    @GetMapping("/workorders/{workOrderId}/timelogs")
    public List<TimeLogResponse> getTimeLogsByWorkOrder(@PathVariable Long workOrderId) {
        return timeLogService.getTimeLogsByWorkOrder(workOrderId);
    }

    @GetMapping("/technicians/{technicianId}/timelogs")
    public List<TimeLogResponse> getTimeLogsByTechnician(@PathVariable Long technicianId) {
        return timeLogService.getTimeLogsByTechnician(technicianId);
    }

    @PutMapping("/timelogs/{timeLogId}")
    public TimeLogResponse updateTimeLog(@PathVariable Long timeLogId,
                                         @Valid @RequestBody CreateTimeLogRequest request) {
        return timeLogService.updateTimeLog(timeLogId, request);
    }

    @DeleteMapping("/timelogs/{timeLogId}")
    public void deleteTimeLog(@PathVariable Long timeLogId) {
        timeLogService.deleteTimeLog(timeLogId);
    }
}
