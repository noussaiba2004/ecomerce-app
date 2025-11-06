package com.example.ecomerce.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDTO {
    private Long id;
    private String customerEmail;
    private String status;
    private LocalDateTime createdAt;
    private List<String> products;
}
