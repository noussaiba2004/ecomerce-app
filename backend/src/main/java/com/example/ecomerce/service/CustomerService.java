package com.example.ecomerce.service;

import com.example.ecomerce.repository.OrderRepository;
import com.example.ecomerce.model.Seller;
import com.example.ecomerce.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final OrderRepository orderRepository;

    public CustomerService( OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<User> getCustomersBySeller(Seller seller) {
        return orderRepository.findDistinctCustomersBySellerId(seller.getId());
    }

}
