package com.example.Examino.Services;

import com.example.Examino.DTO.CreateUserRequest;
import com.example.Examino.DTO.LoginRequest;
import com.example.Examino.Entity.User;
import com.example.Examino.Repositories.UserRepository;
import com.example.Examino.Security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ADMIN creates users
    public ResponseEntity<?> createUser(CreateUserRequest request)  {
        if (userRepository.findByEmail(request.getEmail()) != null) {
        return new ResponseEntity<>("User already exists.", HttpStatus.FORBIDDEN);
    }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // 🔐 PASSWORD ENCRYPTION HAPPENS HERE
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(request.getRole());

        userRepository.save(user);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    // Login for ADMIN & STUDENT
    public ResponseEntity<?> login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail());
        if(user == null) return new ResponseEntity<>("User does not exist",HttpStatus.FORBIDDEN);

        // 🔐 PASSWORD MATCHING
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new ResponseEntity<>(jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()),HttpStatus.OK);
    }
}

