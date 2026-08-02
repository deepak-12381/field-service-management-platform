package com.keystone.backend.controller;

 

import com.keystone.backend.dto.CreateSiteRequest;
import com.keystone.backend.dto.SiteResponse;
import com.keystone.backend.service.SiteService;
import com.keystone.backend.util.JwtUtil;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
 
import org.springframework.data.domain.Page;

 
@RestController
@RequestMapping("/api/sites")
public class SiteController {

    @Autowired
    private SiteService siteService;

    @Autowired
    private JwtUtil jwtUtil;


    @PostMapping
    public SiteResponse createSite(
        @Valid @RequestBody CreateSiteRequest request,
        Authentication authentication)  {

    String email = authentication.getName();

    return siteService.createSite(request, email);
}

  @GetMapping
public Page<SiteResponse> getAllSites(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "siteName") String sortBy,
        @RequestParam(defaultValue = "asc") String direction) {

    return siteService.getAllSites(page, size, sortBy, direction);
}

@GetMapping("/{id}")
public SiteResponse getSiteById(@PathVariable Long id) {

    return siteService.getSiteById(id);

}

@PutMapping("/{id}")
public SiteResponse updateSite(
        @PathVariable Long id,
        @RequestBody CreateSiteRequest request) {

    return siteService.updateSite(id, request);
}
@DeleteMapping("/{id}")
public String deleteSite(@PathVariable Long id) {

    return siteService.deleteSite(id);

}


}