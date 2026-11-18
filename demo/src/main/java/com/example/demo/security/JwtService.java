package com.example.demo.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    @Value("${app.jwt.secret:VaultOnlineDemoSecretKeyChangeBeforeProduction2026}")
    private String secret;
    private SecretKey key() { return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }
    public String create(String phone, String role) {
        long now = System.currentTimeMillis();
        return Jwts.builder().subject(phone).claim("role", role).issuedAt(new Date(now))
                .expiration(new Date(now + 86400000)).signWith(key()).compact();
    }
    public String phone(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload().getSubject();
    }
}