package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.security.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api")
public class BankingController {
    private final UserRepository users;
    private final AccountRepository accounts;
    private final TransactionRepository transactions;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public BankingController(UserRepository users, AccountRepository accounts, TransactionRepository transactions,
                             PasswordEncoder encoder, JwtService jwt) {
        this.users=users; this.accounts=accounts; this.transactions=transactions; this.encoder=encoder; this.jwt=jwt;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody Map<String,String> body) {
        String phone=body.getOrDefault("phone","").trim();
        String password=body.getOrDefault("password","");
        String name=body.getOrDefault("name","").trim();
        if(phone.isBlank() || password.length()<6 || name.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message","Укажите имя, телефон и пароль минимум из 6 символов"));
        if(users.existsByPhone(phone)) return ResponseEntity.badRequest().body(Map.of("message","Такой номер уже зарегистрирован"));
        UserEntity u=new UserEntity(); u.setName(name); u.setEmail(body.get("email")); u.setPhone(phone);
        u.setPassword(encoder.encode(password)); u.setRole("USER"); users.save(u);
        BankAccount a=new BankAccount(); a.setUser(u); a.setAccountNumber("VO"+String.format("%010d",u.getId())); a.setBalance(BigDecimal.ZERO); accounts.save(a);
        return ResponseEntity.ok(authResult(u));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body) {
        UserEntity u=users.findByPhone(body.getOrDefault("phone","")).orElse(null);
        if(u==null || !encoder.matches(body.getOrDefault("password",""),u.getPassword()) || u.isBlocked())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Неверный телефон или пароль"));
        return ResponseEntity.ok(authResult(u));
    }

    @GetMapping("/auth/me")
    public Map<String,Object> me(org.springframework.security.core.Authentication auth) {
        return userView(users.findByPhone(auth.getName()).orElseThrow());
    }

    private Map<String,Object> authResult(UserEntity u) {
        return Map.of("token",jwt.create(u.getPhone(),u.getRole()),"user",userView(u));
    }
    private Map<String,Object> userView(UserEntity u) {
        Map<String,Object> m=new LinkedHashMap<>();
        m.put("id",u.getId()); m.put("name",u.getName()); m.put("email",u.getEmail());
        m.put("phone",u.getPhone()); m.put("role",u.getRole()); m.put("blocked",u.isBlocked()); return m;
    }
    private Map<String,Object> transactionView(BankTransaction t) {
        Map<String,Object> m=new LinkedHashMap<>();
        m.put("id",t.getId()); m.put("type",t.getType()); m.put("amount",t.getAmount());
        m.put("description",t.getDescription()); m.put("status",t.getStatus()); m.put("createdAt",t.getCreatedAt());
        m.put("phone",t.getAccount().getUser().getPhone()); return m;
    }

    @GetMapping("/account")
    public Map<String,Object> account(org.springframework.security.core.Authentication auth) {
        UserEntity u=users.findByPhone(auth.getName()).orElseThrow();
        BankAccount a=accounts.findByUser(u).orElseThrow();
        return Map.of("accountNumber",a.getAccountNumber(),"balance",a.getBalance(),"currency","KZT");
    }

    @GetMapping("/transactions")
    public List<Map<String,Object>> myTransactions(org.springframework.security.core.Authentication auth) {
        UserEntity u=users.findByPhone(auth.getName()).orElseThrow();
        BankAccount a=accounts.findByUser(u).orElseThrow();
        return transactions.findByAccountOrderByCreatedAtDesc(a).stream().map(this::transactionView).toList();
    }

    @PostMapping("/transfers")
    @Transactional
    public ResponseEntity<?> transfer(@RequestBody Map<String,Object> body, org.springframework.security.core.Authentication auth) {
        UserEntity sender=users.findByPhone(auth.getName()).orElseThrow();
        String recipientPhone=String.valueOf(body.getOrDefault("recipientPhone","")).trim();
        BigDecimal amount;
        try { amount=new BigDecimal(String.valueOf(body.get("amount"))); }
        catch(Exception e) { return ResponseEntity.badRequest().body(Map.of("message","Укажите корректную сумму")); }
        if(amount.compareTo(BigDecimal.ZERO)<=0 || amount.scale()>2)
            return ResponseEntity.badRequest().body(Map.of("message","Сумма должна быть положительной и не более 2 знаков после запятой"));
        UserEntity recipient=users.findByPhone(recipientPhone).orElse(null);
        if(recipient==null || recipient.isBlocked() || recipient.getId().equals(sender.getId()))
            return ResponseEntity.badRequest().body(Map.of("message","Получатель не найден или недоступен"));
        BankAccount from=accounts.findByUser(sender).orElseThrow();
        BankAccount to=accounts.findByUser(recipient).orElseThrow();
        if(from.getBalance().compareTo(amount)<0) return ResponseEntity.badRequest().body(Map.of("message","Недостаточно средств"));
        from.setBalance(from.getBalance().subtract(amount)); to.setBalance(to.getBalance().add(amount));
        accounts.save(from); accounts.save(to);
        String description=String.valueOf(body.getOrDefault("description","Перевод"));
        BankTransaction out=new BankTransaction(); out.setAccount(from); out.setType("OUT"); out.setAmount(amount);
        out.setDescription("Перевод пользователю "+recipient.getPhone()+": "+description); transactions.save(out);
        BankTransaction in=new BankTransaction(); in.setAccount(to); in.setType("IN"); in.setAmount(amount);
        in.setDescription("Перевод от "+sender.getPhone()+": "+description); transactions.save(in);
        return ResponseEntity.ok(Map.of("message","Перевод выполнен"));
    }

    @GetMapping("/admin/users") @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String,Object>> allUsers() {
        return users.findAll().stream().map(u -> {
            Map<String,Object> m=userView(u);
            m.put("balance",accounts.findByUser(u).map(BankAccount::getBalance).orElse(BigDecimal.ZERO)); return m;
        }).toList();
    }

    @GetMapping("/admin/transactions") @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String,Object>> allTransactions() {
        return transactions.findAllByOrderByCreatedAtDesc().stream().map(this::transactionView).toList();
    }

    @GetMapping("/admin/stats") @PreAuthorize("hasRole('ADMIN')")
    public Map<String,Object> stats() {
        BigDecimal total=accounts.findAll().stream().map(BankAccount::getBalance).reduce(BigDecimal.ZERO,BigDecimal::add);
        return Map.of("users",users.count(),"transactions",transactions.count(),"balance",total);
    }

    @PatchMapping("/admin/users/{id}/block") @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleBlock(@PathVariable Long id, org.springframework.security.core.Authentication auth) {
        UserEntity target=users.findById(id).orElse(null);
        if(target==null) return ResponseEntity.notFound().build();
        if(target.getPhone().equals(auth.getName())) return ResponseEntity.badRequest().body(Map.of("message","Нельзя заблокировать собственный аккаунт"));
        target.setBlocked(!target.isBlocked()); users.save(target);
        return ResponseEntity.ok(Map.of("blocked",target.isBlocked()));
    }
}