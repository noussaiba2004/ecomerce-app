package com.example.ecomerce.controller;

import com.example.ecomerce.dto.CartItemDTO;
import com.example.ecomerce.dto.CheckoutRequest;
import com.example.ecomerce.model.Order;
import com.example.ecomerce.model.OrderItem;
import com.example.ecomerce.model.Product;
import com.example.ecomerce.model.User;
import com.example.ecomerce.repository.OrderRepository;
import com.example.ecomerce.repository.ProductRepository;
import com.example.ecomerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @PostMapping("/checkout")
    public Order checkout(@RequestBody CheckoutRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus("PAID");

        List<OrderItem> items = new ArrayList<>();
        for (CartItemDTO itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getPrice().doubleValue());

            // Optionnel : mise à jour du stock
            product.setStock(product.getStock() - itemDto.getQuantity());
            productRepository.save(product);

            items.add(orderItem);
        }

        order.setItems(items);
        return orderRepository.save(order);
    }
}
