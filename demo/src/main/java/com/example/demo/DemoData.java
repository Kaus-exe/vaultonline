package com.example.demo;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.util.Random;

@Configuration
public class DemoData {
    @Bean CommandLineRunner seedDemoData(UserRepository users, AccountRepository accounts,
                                         TransactionRepository transactions, PasswordEncoder encoder,
                                         @Value("${app.admin.phone:+77000000001}") String adminPhone,
                                         @Value("${app.admin.password:Admin12345!}") String adminPassword) {
        return args -> {
            UserEntity admin=createUser(users,encoder,"Администратор",adminPhone,adminPassword,"ADMIN");
            createAccount(accounts,admin);
            UserEntity first=createUser(users,encoder,"Александр Иванов","+77000000002","User12345!","USER");
            UserEntity second=createUser(users,encoder,"Мария Смирнова","+77000000003","User12345!","USER");
            BankAccount a=createAccount(accounts,first), b=createAccount(accounts,second);
            if(transactions.count()==0) {
                a.setBalance(new BigDecimal("250000.00")); b.setBalance(new BigDecimal("180000.00"));
                Random random=new Random(42);
                for(int i=0;i<100;i++) {
                    BankAccount account=i%2==0?a:b;
                    String type=i%3==0?"OUT":"IN";
                    BigDecimal amount=BigDecimal.valueOf((random.nextInt(45)+5)*1000L);
                    if(type.equals("OUT") && account.getBalance().compareTo(amount)<0) type="IN";
                    account.setBalance(type.equals("IN")?account.getBalance().add(amount):account.getBalance().subtract(amount));
                    BankTransaction t=new BankTransaction(); t.setAccount(account); t.setType(type); t.setAmount(amount);
                    t.setDescription(type.equals("IN")?"Пополнение счёта":"Оплата покупки"); transactions.save(t);
                }
                accounts.save(a); accounts.save(b);
            }
        };
    }
    private UserEntity createUser(UserRepository users, PasswordEncoder encoder, String name, String phone, String password, String role) {
        return users.findByPhone(phone).orElseGet(() -> {
            UserEntity u=new UserEntity(); u.setName(name); u.setPhone(phone); u.setPassword(encoder.encode(password)); u.setRole(role); return users.save(u);
        });
    }
    private BankAccount createAccount(AccountRepository accounts, UserEntity user) {
        return accounts.findByUser(user).orElseGet(() -> {
            BankAccount a=new BankAccount(); a.setUser(user); a.setAccountNumber("VO"+String.format("%010d",user.getId()));
            a.setBalance(BigDecimal.ZERO); return accounts.save(a);
        });
    }
}