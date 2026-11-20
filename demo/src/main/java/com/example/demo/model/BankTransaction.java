package com.example.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bank_transactions")
public class BankTransaction {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private BankAccount account;
    private String type;
    @Column(precision = 18, scale = 2) private BigDecimal amount;
    private String description;
    private String status = "COMPLETED";
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId(){return id;} public BankAccount getAccount(){return account;} public void setAccount(BankAccount v){account=v;}
    public String getType(){return type;} public void setType(String v){type=v;}
    public BigDecimal getAmount(){return amount;} public void setAmount(BigDecimal v){amount=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public LocalDateTime getCreatedAt(){return createdAt;}
}