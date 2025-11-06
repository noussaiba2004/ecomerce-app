package com.example.ecomerce.dto;

import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequest {
    private Long userId;
    private List<CartItemDTO> items;
}