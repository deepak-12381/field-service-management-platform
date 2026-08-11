 package com.keystone.backend.repository;

import com.keystone.backend.entity.Customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Page<Customer> findByCityContainingIgnoreCase(
            String city,
            Pageable pageable
    );

    Page<Customer> findByStateContainingIgnoreCase(
            String state,
            Pageable pageable
    );

    @Query("""
        SELECT c FROM Customer c
        WHERE LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%'))
    """)
    Page<Customer> findBySearch(
            @Param("search") String search,
            Pageable pageable
    );

    @Query("""
        SELECT c FROM Customer c
        WHERE (
            LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        AND LOWER(c.city) LIKE LOWER(CONCAT('%', :city, '%'))
    """)
    Page<Customer> findBySearchAndCity(
            @Param("search") String search,
            @Param("city") String city,
            Pageable pageable
    );

    @Query("""
        SELECT c FROM Customer c
        WHERE (
            LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        AND LOWER(c.state) LIKE LOWER(CONCAT('%', :state, '%'))
    """)
    Page<Customer> findBySearchAndState(
            @Param("search") String search,
            @Param("state") String state,
            Pageable pageable
    );

    @Query("""
        SELECT c FROM Customer c
        WHERE LOWER(c.city) LIKE LOWER(CONCAT('%', :city, '%'))
        AND LOWER(c.state) LIKE LOWER(CONCAT('%', :state, '%'))
    """)
    Page<Customer> findByCityAndState(
            @Param("city") String city,
            @Param("state") String state,
            Pageable pageable
    );

    @Query("""
        SELECT c FROM Customer c
        WHERE (
            LOWER(c.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        AND LOWER(c.city) LIKE LOWER(CONCAT('%', :city, '%'))
        AND LOWER(c.state) LIKE LOWER(CONCAT('%', :state, '%'))
    """)
    Page<Customer> findBySearchAndCityAndState(
            @Param("search") String search,
            @Param("city") String city,
            @Param("state") String state,
            Pageable pageable
    );

    Page<Customer> findByStatus(
            String status,
            Pageable pageable
    );
}