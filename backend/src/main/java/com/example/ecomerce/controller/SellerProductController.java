package com.example.ecomerce.controller;


import com.example.ecomerce.dto.OrderDTO;
import com.example.ecomerce.dto.ProductDTO;
import com.example.ecomerce.model.Order;
import com.example.ecomerce.model.Seller;
import com.example.ecomerce.repository.OrderRepository;
import com.example.ecomerce.repository.SellerRepository;
import com.example.ecomerce.service.ProductService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.format.annotation.DateTimeFormat;


import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seller/dashboard")
public class SellerProductController {


    private final ProductService productService;
    private final OrderRepository orderRepository;
    private final SellerRepository sellerRepository;


    public SellerProductController(ProductService productService, OrderRepository orderRepository, SellerRepository sellerRepository) {
        this.productService = productService;
        this.orderRepository = orderRepository;
        this.sellerRepository = sellerRepository;
    }


    @GetMapping("/products")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<List<ProductDTO>> myProducts(Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(productService.findBySeller(email));
    }


    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ProductDTO> createProduct(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam BigDecimal price,
            @RequestParam Integer stock,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) List<MultipartFile> images,
            Principal principal
    ) throws IOException {
        String email = principal.getName();

        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            Path uploadDir = Paths.get("uploads"); // dossier à la racine du projet
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                    Path filePath = uploadDir.resolve(filename);
                    Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    imageUrls.add("/uploads/" + filename); // ✅ chemin public
                }
            }
        }

        ProductDTO dto = ProductDTO.builder()
                .name(name)
                .description(description)
                .price(price)
                .stock(stock)
                .category(category)
                .imageUrls(imageUrls)
                .build();

        return ResponseEntity.ok(productService.create(dto, email));
    }


    @PutMapping("/products/{id}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductDTO dto, Principal principal) {
        String email = principal.getName();
        return productService.update(id, dto, email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, Principal principal) {
        String email = principal.getName();
        boolean ok = productService.delete(id, email);
        if (ok) return ResponseEntity.ok().build();
        return ResponseEntity.notFound().build();
    }


    // ✅ Récupérer tous les ordres liés aux produits du vendeur
    @GetMapping("/orders")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<List<OrderDTO>> getSellerOrders(
            Principal principal,
            @RequestParam(required = false) String status,           // ✅ filtre par statut (ex: PAID, SHIPPED)
            @RequestParam(required = false) String customerEmail,    // ✅ filtre par email client
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate, // ✅ depuis une date
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate     // ✅ jusqu’à une date
    ) {
        String email = principal.getName();

        // 🔹 1️⃣ Récupérer le vendeur connecté
        Seller seller = sellerRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        // 🔹 2️⃣ Récupérer tous les ordres associés à ses produits
        List<Order> orders = orderRepository.findOrdersBySellerId(seller.getId());

        // 🔹 3️⃣ Appliquer les filtres optionnels
        List<Order> filteredOrders = orders.stream()
                .filter(o -> (status == null || o.getStatus().equalsIgnoreCase(status)))
                .filter(o -> (customerEmail == null || o.getUser().getEmail().equalsIgnoreCase(customerEmail)))
                .filter(o -> (fromDate == null || o.getCreatedAt().isAfter(fromDate)))
                .filter(o -> (toDate == null || o.getCreatedAt().isBefore(toDate)))
                .toList();

        // 🔹 4️⃣ Conversion en DTO
        List<OrderDTO> orderDTOs = filteredOrders.stream()
                .map(order -> OrderDTO.builder()
                        .id(order.getId())
                        .customerEmail(order.getUser().getEmail())
                        .status(order.getStatus())
                        .createdAt(order.getCreatedAt())
                        .products(order.getItems().stream()
                                .filter(i -> i.getProduct().getSeller().getId().equals(seller.getId()))
                                .map(i -> i.getProduct().getName() + " (x" + i.getQuantity() + ")")
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderDTOs);
    }

    // ✅ Modifier le statut d’un ordre
    @PutMapping("/orders/{orderId}/status")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status,
            Principal principal
    ) {
        String email = principal.getName();
        Seller seller = sellerRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order order = optionalOrder.get();

        boolean isSellerOrder = order.getItems().stream()
                .anyMatch(i -> i.getProduct().getSeller().getId().equals(seller.getId()));

        if (!isSellerOrder) {
            return ResponseEntity.status(403).body("Unauthorized: this order doesn't belong to your products");
        }

        order.setStatus(status);
        orderRepository.save(order);
        return ResponseEntity.ok("Order status updated to " + status);
    }




}