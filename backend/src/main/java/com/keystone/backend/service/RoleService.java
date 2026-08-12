package com.keystone.backend.service;

import com.keystone.backend.dto.RoleResponse;
import com.keystone.backend.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll()
                .stream()
                .map(role -> new RoleResponse(role.getId(), role.getName()))
                .collect(Collectors.toList());
    }
}
