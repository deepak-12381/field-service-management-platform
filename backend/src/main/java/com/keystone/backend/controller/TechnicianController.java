package com.keystone.backend.controller;

import com.keystone.backend.dto.CreateTechnicianRequest;
import com.keystone.backend.dto.TechnicianResponse;
import com.keystone.backend.service.TechnicianService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {

    private final TechnicianService technicianService;

    public TechnicianController(TechnicianService technicianService) {
        this.technicianService = technicianService;
    }

    @PostMapping
    public ResponseEntity<TechnicianResponse> createTechnician(@Valid @RequestBody CreateTechnicianRequest request) {
        return ResponseEntity.ok(technicianService.createTechnician(request));
    }

    @GetMapping
    public ResponseEntity<Page<TechnicianResponse>> getAllTechnicians(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return ResponseEntity.ok(technicianService.getAllTechnicians(page, size, sortBy, direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TechnicianResponse> getTechnicianById(@PathVariable Long id) {
        return ResponseEntity.ok(technicianService.getTechnicianById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TechnicianResponse> updateTechnician(@PathVariable Long id, @Valid @RequestBody CreateTechnicianRequest request) {
        return ResponseEntity.ok(technicianService.updateTechnician(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTechnician(@PathVariable Long id) {
        technicianService.deleteTechnician(id);
        return ResponseEntity.noContent().build();
    }
}
