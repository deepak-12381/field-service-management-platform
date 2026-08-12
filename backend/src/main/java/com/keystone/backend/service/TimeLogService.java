package com.keystone.backend.service;

import com.keystone.backend.dto.CreateTimeLogRequest;
import com.keystone.backend.dto.TimeLogResponse;
import com.keystone.backend.entity.TimeLog;
import com.keystone.backend.entity.User;
import com.keystone.backend.entity.WorkOrder;
import com.keystone.backend.exception.BadRequestException;
import com.keystone.backend.exception.ResourceNotFoundException;
import com.keystone.backend.repository.TimeLogRepository;
import com.keystone.backend.repository.UserRepository;
import com.keystone.backend.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimeLogService {

    private final TimeLogRepository timeLogRepository;
    private final WorkOrderRepository workOrderRepository;
    private final UserRepository userRepository;

    public TimeLogService(TimeLogRepository timeLogRepository,
                          WorkOrderRepository workOrderRepository,
                          UserRepository userRepository) {
        this.timeLogRepository = timeLogRepository;
        this.workOrderRepository = workOrderRepository;
        this.userRepository = userRepository;
    }

    public TimeLogResponse createTimeLog(Long workOrderId,
                                         CreateTimeLogRequest request) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work Order not found with ID: " + workOrderId));

        User technician = userRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + request.getTechnicianId()));

        if (request.getEndTime() != null && request.getEndTime().isBefore(request.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        TimeLog timeLog = new TimeLog();
        timeLog.setWorkOrder(workOrder);
        timeLog.setTechnician(technician);
        timeLog.setStartTime(request.getStartTime());
        timeLog.setEndTime(request.getEndTime());
        timeLog.setNotes(request.getNotes());
        timeLog.setCreatedAt(LocalDateTime.now());
        timeLog.setHoursLogged(calculateHours(request.getStartTime(), request.getEndTime()));

        return mapToResponse(timeLogRepository.save(timeLog));
    }

    public List<TimeLogResponse> getTimeLogsByWorkOrder(Long workOrderId) {
        if (!workOrderRepository.existsById(workOrderId)) {
            throw new ResourceNotFoundException("Work Order not found with ID: " + workOrderId);
        }

        return timeLogRepository.findByWorkOrderId(workOrderId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TimeLogResponse> getTimeLogsByTechnician(Long technicianId) {
        if (!userRepository.existsById(technicianId)) {
            throw new ResourceNotFoundException("Technician not found with ID: " + technicianId);
        }

        return timeLogRepository.findByTechnicianId(technicianId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TimeLogResponse updateTimeLog(Long timeLogId, CreateTimeLogRequest request) {
        TimeLog timeLog = timeLogRepository.findById(timeLogId)
                .orElseThrow(() -> new ResourceNotFoundException("Time log not found with ID: " + timeLogId));

        User technician = userRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + request.getTechnicianId()));

        if (request.getEndTime() != null && request.getEndTime().isBefore(request.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        timeLog.setTechnician(technician);
        timeLog.setStartTime(request.getStartTime());
        timeLog.setEndTime(request.getEndTime());
        timeLog.setNotes(request.getNotes());
        timeLog.setHoursLogged(calculateHours(request.getStartTime(), request.getEndTime()));

        return mapToResponse(timeLogRepository.save(timeLog));
    }

    public void deleteTimeLog(Long timeLogId) {
        TimeLog timeLog = timeLogRepository.findById(timeLogId)
                .orElseThrow(() -> new ResourceNotFoundException("Time log not found with ID: " + timeLogId));
        timeLogRepository.delete(timeLog);
    }

    private BigDecimal calculateHours(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            return null;
        }
        long minutes = Duration.between(start, end).toMinutes();
        return BigDecimal.valueOf(minutes)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
    }

    private TimeLogResponse mapToResponse(TimeLog timeLog) {
        TimeLogResponse response = new TimeLogResponse();
        response.setId(timeLog.getId());
        response.setWorkOrderId(timeLog.getWorkOrder().getId());
        response.setTechnicianId(timeLog.getTechnician().getId());
        response.setTechnicianName(timeLog.getTechnician().getFullName());
        response.setStartTime(timeLog.getStartTime());
        response.setEndTime(timeLog.getEndTime());
        response.setHoursLogged(timeLog.getHoursLogged());
        response.setNotes(timeLog.getNotes());
        response.setCreatedAt(timeLog.getCreatedAt());
        return response;
    }
}
