 package com.keystone.backend.repository;

import com.keystone.backend.entity.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
 

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
 long countByStatus(String status);

long countByPriority(String priority);

List<WorkOrder> findByStatus(String status);

List<WorkOrder> findByPriority(String priority);

List<WorkOrder> findByTechnician_Id(Long technicianId);

List<WorkOrder> findBySite_Id(Long siteId);

}