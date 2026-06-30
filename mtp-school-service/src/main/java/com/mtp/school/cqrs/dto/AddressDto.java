package com.mtp.school.cqrs.dto;

import lombok.Data;

@Data
public class AddressDto {
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    private String district;
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    private String commune;
    public String getCommune() { return commune; }
    public void setCommune(String commune) { this.commune = commune; }

    private String village;
    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }
}
