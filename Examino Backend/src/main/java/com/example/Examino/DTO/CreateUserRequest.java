package com.example.Examino.DTO;


import com.example.Examino.Enums.Role;
import lombok.Data;

@Data
public class CreateUserRequest {
    private String name;
    private String email;
    private String password;
    private Role role; // ADMIN / STUDENT

    // getters & setters
}
