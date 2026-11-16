package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/credit")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}) // Разрешаем оба порта
public class CreditController {

    @GetMapping("/calculate")
    public ResponseEntity<?> calculateCredit(
            @RequestParam double amount,
            @RequestParam int months,
            @RequestParam double rate
    ) {
        double monthlyRate = rate / 100.0 / 12.0;
        double monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) 
                / (Math.pow(1 + monthlyRate, months) - 1);

        long roundedPayment = Math.round(monthlyPayment);

        return ResponseEntity.ok(Map.of(
                "monthlyPayment", roundedPayment,
                "totalAmount", roundedPayment * months
        ));
    }
}