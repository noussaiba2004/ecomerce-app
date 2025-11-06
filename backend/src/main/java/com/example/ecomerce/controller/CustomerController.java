package com.example.ecomerce.controller;

import com.example.ecomerce.model.Seller;
import com.example.ecomerce.model.User;
import com.example.ecomerce.repository.SellerRepository;
import com.example.ecomerce.repository.UserRepository;
import com.example.ecomerce.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/seller/customers")
public class CustomerController {

    private final CustomerService customerService;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;


    public CustomerController(CustomerService customerService, UserRepository userRepository, SellerRepository sellerRepository) {
        this.customerService = customerService;
        this.userRepository = userRepository;
        this.sellerRepository = sellerRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<User>> getMyCustomers(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Seller seller = sellerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

    
        List<User> customers = customerService.getCustomersBySeller(seller);
        return ResponseEntity.ok(customers);
    }

}
