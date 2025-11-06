package com.example.ecomerce.dto;

import lombok.Data;

@Data
public class SellerRegisterRequest {
    private String username;
    private String email;
    private String password;
    private String companyName;
    private String phone;
    private String address;
}