package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bank_users")
public class UserEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    @Column(unique = true, nullable = false)
    private String phone;
    @Column(nullable = false)
    private String password;
    private String role = "USER";
    private boolean blocked = false;

    public Long getId(){return id;} public String getName(){return name;} public void setName(String v){name=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getPhone(){return phone;} public void setPhone(String v){phone=v;}
    public String getPassword(){return password;} public void setPassword(String v){password=v;}
    public String getRole(){return role;} public void setRole(String v){role=v;}
    public boolean isBlocked(){return blocked;} public void setBlocked(boolean v){blocked=v;}
}