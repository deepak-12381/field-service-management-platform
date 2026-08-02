 package com.keystone.backend.service;

import com.keystone.backend.repository.WorkOrderRepository;
import com.keystone.backend.repository.SiteRepository;
import com.keystone.backend.repository.UserRepository;
import com.keystone.backend.repository.WorkOrderStatusHistoryRepository;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.keystone.backend.dto.CreateWorkOrderRequest;
import com.keystone.backend.dto.WorkOrderResponse;
import com.keystone.backend.entity.Site;
import com.keystone.backend.entity.WorkOrder;
import com.keystone.backend.exception.ResourceNotFoundException;

import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import java.util.List;
import java.util.ArrayList;
import static org.mockito.Mockito.verify;


@ExtendWith(MockitoExtension.class)
class WorkOrderServiceTest {

    @Mock
    private WorkOrderRepository workOrderRepository;

    @Mock
    private SiteRepository siteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private WorkOrderStatusHistoryRepository historyRepository;

    @InjectMocks
    private WorkOrderService workOrderService;

    @Test
void testCreateWorkOrderSuccess() {

    CreateWorkOrderRequest request = new CreateWorkOrderRequest();
    request.setTitle("Network Issue");
    request.setDescription("Internet is down");
    request.setPriority("High");
    request.setStatus("Open");
    request.setCreatedBy("admin@gmail.com");
    request.setSiteId(1L);

    Site site = new Site();
    site.setId(1L);
    site.setSiteName("ABC Site");

    WorkOrder savedWorkOrder = new WorkOrder();
    savedWorkOrder.setId(1L);
    savedWorkOrder.setTitle(request.getTitle());
    savedWorkOrder.setDescription(request.getDescription());
    savedWorkOrder.setPriority(request.getPriority());
    savedWorkOrder.setStatus(request.getStatus());
    savedWorkOrder.setCreatedBy(request.getCreatedBy());
    savedWorkOrder.setSite(site);

    when(siteRepository.findById(1L))
            .thenReturn(Optional.of(site));

    when(workOrderRepository.save(any(WorkOrder.class)))
            .thenReturn(savedWorkOrder);

    WorkOrderResponse response =
            workOrderService.createWorkOrder(request);

    assertEquals(1L, response.getId());
    assertEquals("Network Issue", response.getTitle());
    assertEquals("High", response.getPriority());
    assertEquals("ABC Site", response.getSiteName());
}

 @Test
void testCreateWorkOrderSiteNotFound() {

    CreateWorkOrderRequest request = new CreateWorkOrderRequest();
    request.setSiteId(100L);

    when(siteRepository.findById(100L))
            .thenReturn(Optional.empty());

    assertThrows(
            ResourceNotFoundException.class,
            () -> workOrderService.createWorkOrder(request)
    );
}
@Test
void testGetAllWorkOrders() {

    Site site = new Site();
    site.setId(1L);
    site.setSiteName("ABC Site");

    WorkOrder workOrder = new WorkOrder();
    workOrder.setId(1L);
    workOrder.setTitle("Network Issue");
    workOrder.setDescription("Internet Down");
    workOrder.setPriority("High");
    workOrder.setStatus("Open");
    workOrder.setCreatedBy("admin@gmail.com");
    workOrder.setSite(site);

    List<WorkOrder> workOrders = new ArrayList<>();
    workOrders.add(workOrder);

    when(workOrderRepository.findAll())
            .thenReturn(workOrders);

    List<WorkOrderResponse> response =
            workOrderService.getAllWorkOrders();

    assertEquals(1, response.size());
    assertEquals("Network Issue", response.get(0).getTitle());
    assertEquals("ABC Site", response.get(0).getSiteName());
}
 @Test
void testGetWorkOrderByIdSuccess() {

    Site site = new Site();
    site.setId(1L);
    site.setSiteName("ABC Site");

    WorkOrder workOrder = new WorkOrder();
    workOrder.setId(1L);
    workOrder.setTitle("Network Issue");
    workOrder.setDescription("Internet Down");
    workOrder.setPriority("High");
    workOrder.setStatus("Open");
    workOrder.setCreatedBy("admin@gmail.com");
    workOrder.setSite(site);

    when(workOrderRepository.findById(1L))
            .thenReturn(Optional.of(workOrder));

    WorkOrderResponse response =
            workOrderService.getWorkOrderById(1L);

    assertEquals(1L, response.getId());
    assertEquals("Network Issue", response.getTitle());
    assertEquals("ABC Site", response.getSiteName());
}
@Test
void testGetWorkOrderByIdNotFound() {

    when(workOrderRepository.findById(100L))
            .thenReturn(Optional.empty());

    assertThrows(
            ResourceNotFoundException.class,
            () -> workOrderService.getWorkOrderById(100L)
    );
}
@Test
void testUpdateWorkOrderSuccess() {

    CreateWorkOrderRequest request = new CreateWorkOrderRequest();
    request.setTitle("Updated Work");
    request.setDescription("Updated Description");
    request.setPriority("Medium");
    request.setStatus("Closed");
    request.setCreatedBy("admin@gmail.com");
    request.setSiteId(1L);

    Site site = new Site();
    site.setId(1L);
    site.setSiteName("ABC Site");

    WorkOrder workOrder = new WorkOrder();
    workOrder.setId(1L);
    workOrder.setTitle("Old Work");
    workOrder.setStatus("Open");
    workOrder.setSite(site);

    when(workOrderRepository.findById(1L))
            .thenReturn(Optional.of(workOrder));

    when(siteRepository.findById(1L))
            .thenReturn(Optional.of(site));

    when(workOrderRepository.save(any(WorkOrder.class)))
            .thenReturn(workOrder);

    WorkOrderResponse response =
            workOrderService.updateWorkOrder(1L, request);

    assertEquals("Updated Work", response.getTitle());
    assertEquals("Closed", response.getStatus());
    assertEquals("ABC Site", response.getSiteName());
}
@Test
void testUpdateWorkOrderNotFound() {

    CreateWorkOrderRequest request = new CreateWorkOrderRequest();
    request.setSiteId(1L);

    when(workOrderRepository.findById(100L))
            .thenReturn(Optional.empty());

    assertThrows(
            ResourceNotFoundException.class,
            () -> workOrderService.updateWorkOrder(100L, request)
    );
}
@Test
void testDeleteWorkOrderSuccess() {

    WorkOrder workOrder = new WorkOrder();
    workOrder.setId(1L);

    when(workOrderRepository.findById(1L))
            .thenReturn(Optional.of(workOrder));

    workOrderService.deleteWorkOrder(1L);

    verify(workOrderRepository).delete(workOrder);
}
@Test
void testDeleteWorkOrderNotFound() {

    when(workOrderRepository.findById(100L))
            .thenReturn(Optional.empty());

    assertThrows(
            ResourceNotFoundException.class,
            () -> workOrderService.deleteWorkOrder(100L)
    );
}

}