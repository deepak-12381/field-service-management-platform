 package com.keystone.backend.repository;

import com.keystone.backend.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {
    java.util.List<Site> findBySiteNameContainingIgnoreCaseOrAddressContainingIgnoreCase(String siteName, String address);
    java.util.List<Site> findByStatus(String status);
}