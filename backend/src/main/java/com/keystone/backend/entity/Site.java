 package com.keystone.backend.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDateTime;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;


@Entity
@Table(name = "sites")
public class Site {

    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String siteName;

private String address;

private String city;

private String state;

private String pincode;
    

private LocalDateTime createdAt;

private String createdBy;


@ManyToOne
@JoinColumn(name = "customer_id")
private Customer customer;


public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}

public String getSiteName() {
    return siteName;
}

public void setSiteName(String siteName) {
    this.siteName = siteName;
}

public String getAddress() {
    return address;
}

public void setAddress(String address) {
    this.address = address;
}

public String getCity() {
    return city;
}

public void setCity(String city) {
    this.city = city;
}

public String getState() {
    return state;
}

public void setState(String state) {
    this.state = state;
}

public String getPincode() {
    return pincode;
}

public void setPincode(String pincode) {
    this.pincode = pincode;
}

public LocalDateTime getCreatedAt() {
    return createdAt;
}

public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
}

public String getCreatedBy() {
    return createdBy;
}

public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
}

public Customer getCustomer() {
    return customer;
}

public void setCustomer(Customer customer) {
    this.customer = customer;
}

  
public Site() {
}

public Site(Long id, String siteName, String address, String city,
            String state, String pincode, LocalDateTime createdAt,
            String createdBy, Customer customer) {

    this.id = id;
    this.siteName = siteName;
    this.address = address;
    this.city = city;
    this.state = state;
    this.pincode = pincode;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.customer = customer;
}




}
