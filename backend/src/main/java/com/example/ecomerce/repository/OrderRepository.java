package com.example.ecomerce.repository;

import com.example.ecomerce.model.Order;
import com.example.ecomerce.model.Seller;
import com.example.ecomerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT DISTINCT o FROM Order o " +
            "JOIN o.items i " +
            "WHERE i.product.seller.id = :sellerId")
    List<Order> findOrdersBySellerId(Long sellerId);
    @Query("""
        SELECT DISTINCT o.user 
        FROM Order o
        JOIN o.items oi
        JOIN oi.product p
        WHERE p.seller.id = :sellerId
    """)
    List<User> findDistinctCustomersBySellerId(@Param("sellerId") Long sellerId);
}
