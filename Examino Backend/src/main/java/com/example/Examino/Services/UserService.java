package com.example.Examino.Services;

import com.example.Examino.Entity.User;
import com.example.Examino.Enums.Role;
import com.example.Examino.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 1️⃣ Register a new user
    public User registerUser(User user) {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already registered");
        }

        user.setCreatedAt(LocalDateTime.now());

        // Optional: set role to STUDENT by default if not provided
        if (user.getRole() == null) {
            user.setRole(Role.STUDENT);
        }

        return userRepository.save(user);
    }

    // 2️⃣ Login user
    public ResponseEntity<?> login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if(user == null) return new ResponseEntity<>("User not found.", HttpStatus.FORBIDDEN);

        // For simplicity, plain text comparison (later you can use BCrypt)
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    // 3️⃣ Fetch user by ID
    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 4️⃣ Fetch all users by role (optional)
    public List<User> getUsersByRole(Role role) {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == role)
                .collect(Collectors.toList());
    }
}