package com.example.Examino.DTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    // getters & setters
}