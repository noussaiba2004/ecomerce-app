package com.example.ecomerce.controller;

import com.example.ecomerce.dto.ProductDTO;
import com.example.ecomerce.model.ProductImage;
import com.example.ecomerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(product -> ProductDTO.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .description(product.getDescription())
                        .price(product.getPrice())
                        .stock(product.getStock())
                        .category(product.getCategory())
                        .imageUrls(
                                product.getImages() != null ?
                                        product.getImages().stream().map(img -> img.getUrl()).toList() :
                                        List.of()
                        )
                        .build()
                ).toList();
    }

}
