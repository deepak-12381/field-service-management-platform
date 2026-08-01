 package com.keystone.backend.dto;
 import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class CreateSiteRequest {

     
     
    @NotBlank(message = "Site name is required")
private String siteName;

@NotBlank(message = "Address is required")
private String address;

@NotBlank(message = "City is required")
private String city;

@NotBlank(message = "State is required")
private String state;

@NotBlank(message = "Pincode is required")
@Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be exactly 6 digits")
private String pincode;

@NotNull(message = "Customer ID is required")
private Long customerId;
    public CreateSiteRequest() {
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

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
}