package com.example.ecomerce.repository;

import com.example.ecomerce.model.Seller;
import com.example.ecomerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {

    Optional<Seller> findByUserEmail(String email);
    Optional<Seller> findByUser(User user);

}
