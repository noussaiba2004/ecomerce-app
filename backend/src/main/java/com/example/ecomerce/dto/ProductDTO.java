package com.example.ecomerce.dto;

import com.example.ecomerce.model.Product;
import com.example.ecomerce.model.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String category;
    private List<String> imageUrls;

    public static ProductDTO toDTO(Product product) {
        List<String> imageUrls = product.getImages() != null
                ? product.getImages().stream()
                .map(ProductImage::getUrl)
                .toList()
                : List.of();

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(product.getCategory())
                .imageUrls(imageUrls)
                .build();
    }


}
