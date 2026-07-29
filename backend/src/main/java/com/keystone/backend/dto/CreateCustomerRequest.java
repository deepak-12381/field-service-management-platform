 package com.keystone.backend.dto;

public class CreateCustomerRequest {

    private String customerName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String pincode;

    public CreateCustomerRequest() {
    }

    public CreateCustomerRequest(String customerName, String email, String phone,
                                 String address, String city, String state,
                                 String pincode) {
        this.customerName = customerName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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
}