package com.keystone.backend.service;

import com.keystone.backend.dto.CreateTechnicianRequest;
import com.keystone.backend.dto.TechnicianResponse;
import com.keystone.backend.entity.User;
import com.keystone.backend.entity.Role;
import com.keystone.backend.exception.ResourceNotFoundException;
import com.keystone.backend.repository.RoleRepository;
import com.keystone.backend.repository.UserRepository;
import com.keystone.backend.repository.WorkOrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class TechnicianService {

    private final UserRepository userRepository;
    private final WorkOrderRepository workOrderRepository;
    private final RoleRepository roleRepository;

    public TechnicianService(UserRepository userRepository,
                               WorkOrderRepository workOrderRepository,
                               RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.workOrderRepository = workOrderRepository;
        this.roleRepository = roleRepository;
    }

    public TechnicianResponse createTechnician(CreateTechnicianRequest request) {
        Role technicianRole = roleRepository.findByName("TECHNICIAN")
                .orElseThrow(() -> new ResourceNotFoundException("TECHNICIAN role not found"));

        User technician = new User();
        technician.setFullName(request.getFullName());
        technician.setEmail(request.getEmail());
        technician.setPhone(request.getPhone());
        technician.setSkills(request.getSkills());
        technician.setStatus(request.getStatus());
        technician.setPassword("temp-password");
        technician.setRole(technicianRole);
        technician = userRepository.save(technician);
        return mapToResponse(technician);
    }

    public Page<TechnicianResponse> getAllTechnicians(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findByRole_Name("TECHNICIAN", pageable).map(this::mapToResponse);
    }

    public TechnicianResponse getTechnicianById(Long id) {
        User technician = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + id));
        return mapToResponse(technician);
    }

    public TechnicianResponse updateTechnician(Long id, CreateTechnicianRequest request) {
        User technician = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + id));
        technician.setFullName(request.getFullName());
        technician.setEmail(request.getEmail());
        technician.setPhone(request.getPhone());
        technician.setSkills(request.getSkills());
        technician.setStatus(request.getStatus());
        return mapToResponse(userRepository.save(technician));
    }

    public void deleteTechnician(Long id) {
        User technician = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + id));
        userRepository.delete(technician);
    }

    private TechnicianResponse mapToResponse(User technician) {
        long assigned = workOrderRepository.countByTechnician_Id(technician.getId());
        return new TechnicianResponse(
                technician.getId(),
                technician.getFullName(),
                technician.getEmail(),
                technician.getPhone(),
                technician.getSkills(),
                technician.getStatus(),
                assigned
        );
    }
}
