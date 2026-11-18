package com.example.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "bank_accounts")
public class BankAccount {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(optional = false) private UserEntity user;
    @Column(unique = true, nullable = false) private String accountNumber;
    @Column(nullable = false, precision = 18, scale = 2) private BigDecimal balance = BigDecimal.ZERO;

    public Long getId(){return id;} public UserEntity getUser(){return user;} public void setUser(UserEntity v){user=v;}
    public String getAccountNumber(){return accountNumber;} public void setAccountNumber(String v){accountNumber=v;}
    public BigDecimal getBalance(){return balance;} public void setBalance(BigDecimal v){balance=v;}
}