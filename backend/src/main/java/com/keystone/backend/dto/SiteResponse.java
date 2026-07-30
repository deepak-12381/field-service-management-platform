 package com.keystone.backend.dto;

public class SiteResponse {

    private Long id;
    private String siteName;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String customerName;

    public SiteResponse(Long id, String siteName, String address,
                        String city, String state, String pincode,
                        String customerName) {
        this.id = id;
        this.siteName = siteName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.customerName = customerName;
    }

    public Long getId() {
        return id;
    }

    public String getSiteName() {
        return siteName;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getPincode() {
        return pincode;
    }

    public String getCustomerName() {
        return customerName;
    }
}