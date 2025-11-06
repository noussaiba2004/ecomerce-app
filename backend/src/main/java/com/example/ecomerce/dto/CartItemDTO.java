package com.example.ecomerce.dto;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long productId;
    private int quantity;
}
