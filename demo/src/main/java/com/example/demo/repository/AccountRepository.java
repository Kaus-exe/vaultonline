package com.example.demo.repository;
import com.example.demo.model.BankAccount;
import com.example.demo.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AccountRepository extends JpaRepository<BankAccount, Long> {
    Optional<BankAccount> findByUser(UserEntity user);
}