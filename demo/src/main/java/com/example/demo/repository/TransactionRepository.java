package com.example.demo.repository;
import com.example.demo.model.BankAccount;
import com.example.demo.model.BankTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TransactionRepository extends JpaRepository<BankTransaction, Long> {
    List<BankTransaction> findByAccountOrderByCreatedAtDesc(BankAccount account);
    List<BankTransaction> findAllByOrderByCreatedAtDesc();
}