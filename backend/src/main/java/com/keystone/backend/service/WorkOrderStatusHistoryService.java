 package com.keystone.backend.service;

import com.keystone.backend.dto.WorkOrderStatusHistoryResponse;
import com.keystone.backend.entity.WorkOrderStatusHistory;
import com.keystone.backend.repository.WorkOrderStatusHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkOrderStatusHistoryService {

    private final WorkOrderStatusHistoryRepository historyRepository;

    public WorkOrderStatusHistoryService(
            WorkOrderStatusHistoryRepository historyRepository) {

        this.historyRepository = historyRepository;
    }

    public List<WorkOrderStatusHistoryResponse> getHistoryByWorkOrder(Long workOrderId) {

        return historyRepository.findByWorkOrderId(workOrderId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private WorkOrderStatusHistoryResponse mapToResponse(
            WorkOrderStatusHistory history) {

        WorkOrderStatusHistoryResponse response =
                new WorkOrderStatusHistoryResponse();

        response.setId(history.getId());
        response.setWorkOrderId(history.getWorkOrder().getId());
        response.setOldStatus(history.getOldStatus());
        response.setNewStatus(history.getNewStatus());
        response.setChangedBy(history.getChangedBy());
        response.setChangedAt(history.getChangedAt());

        return response;
    }
}