package com.example.Examino.Entity;

import com.example.Examino.Enums.Role;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private String otp=null;

    private LocalDateTime createdAt = LocalDateTime.now();
}