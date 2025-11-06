package com.example.ecomerce.service;

import com.example.ecomerce.dto.ProductDTO;
import com.example.ecomerce.model.Product;
import com.example.ecomerce.model.ProductImage;
import com.example.ecomerce.model.Seller;
import com.example.ecomerce.model.User;
import com.example.ecomerce.repository.ProductRepository;
import com.example.ecomerce.repository.SellerRepository;
import com.example.ecomerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository repo;
    private final SellerRepository sellerRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepository;

    public ProductService(ProductRepository repo, SellerRepository sellerRepo, UserRepository userRepo, ProductRepository productRepository) {
        this.repo = repo;
        this.sellerRepo = sellerRepo;
        this.userRepo = userRepo;
        this.productRepository = productRepository;
    }

    public List<ProductDTO> findBySeller(String sellerEmail) {
        return repo.findBySellerUserEmail(sellerEmail).stream().map(this::toDto).collect(Collectors.toList());
    }

    public ProductDTO create(ProductDTO dto, String sellerEmail) {
        Seller seller = sellerRepo.findByUserEmail(sellerEmail)
                .orElseGet(() -> createSellerProfile(sellerEmail));

        Product p = new Product();
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        p.setPrice(dto.getPrice());
        p.setStock(dto.getStock());
        p.setCategory(dto.getCategory());
        p.setSeller(seller);
        // Convert List<String> to List<ProductImage>
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            List<ProductImage> imgs = dto.getImageUrls().stream()
                    .map(url -> ProductImage.builder().url(url).product(p).build())
                    .toList();
            p.setImages(imgs);
        }
        Product saved = repo.save(p);
        return toDto(saved);
    }

    private Seller createSellerProfile(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Create a default seller profile
        Seller seller = Seller.builder()
                .user(user)
                .companyName(user.getUsername() + "'s Store")
                .phone("Not provided")
                .address("Not provided")
                .build();

        // Update user role to SELLER
        user.setRole("SELLER");
        userRepo.save(user);

        return sellerRepo.save(seller);
    }

    public Optional<ProductDTO> update(Long id, ProductDTO dto, String sellerEmail) {
        return repo.findById(id).map(p -> {
            if (!sellerEmail.equals(p.getSeller().getUser().getEmail())) {
                throw new SecurityException("Not your product");
            }
            p.setName(dto.getName());
            p.setDescription(dto.getDescription());
            p.setPrice(dto.getPrice());
            p.setStock(dto.getStock());
            p.getImages().clear();
            List<ProductImage> newImages = dto.getImageUrls().stream()
                    .map(url -> ProductImage.builder().url(url).product(p).build())
                    .collect(Collectors.toList());
            p.getImages().addAll(newImages);
            return toDto(repo.save(p));
        });
    }

    public boolean delete(Long id, String sellerEmail) {
        return repo.findById(id).map(p -> {
            if (!sellerEmail.equals(p.getSeller().getUser().getEmail())) {
                throw new SecurityException("Not your product");
            }
            repo.delete(p);
            return true;
        }).orElse(false);
    }

    private ProductDTO toDto(Product p) {
        return ProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .stock(p.getStock())
                .category(p.getCategory())
                .imageUrls(
                        p.getImages() != null ?
                                p.getImages().stream().map(ProductImage::getUrl).toList() :
                                List.of()
                )
                .build();
    }

    public List<ProductDTO> findByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(ProductDTO::toDTO)
                .toList();
    }

    public List<ProductDTO> getAllProducts(String category, String search) {
        List<Product> products;

        if (category != null && !category.isEmpty()) {
            products = productRepository.findByCategoryIgnoreCase(category);
        } else if (search != null && !search.isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCase(search);
        } else {
            products = productRepository.findAll();
        }

        return products.stream()
                .map(ProductDTO::toDTO)
                .toList();
    }

    public List<ProductDTO> searchProducts(String search) {
        return productRepository.findByNameContainingIgnoreCase(search)
                .stream()
                .map(ProductDTO::toDTO)
                .toList();
    }

    public List<ProductDTO> findAll() {
        return productRepository.findAll()
                .stream()
                .map(ProductDTO::toDTO)
                .toList();
    }

}