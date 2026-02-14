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

import java.util.Map;

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


        User user = userRepository.findByEmail(request.getEmail());
        user.setName(request.getName());



        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(request.getRole());

        userRepository.save(user);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    // Login for ADMIN & STUDENT
    public ResponseEntity<?> login(LoginRequest request){

        User user=userRepository.findByEmail(request.getEmail());

        if(user==null){
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message","User does not exist"));
        }

        // password check
        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message","Invalid credentials"));
        }

        // generate token
        String token=jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        // return JSON instead of raw string
        return ResponseEntity.ok(
                Map.of(
                        "token",token,
                        "email",user.getEmail(),
                        "role",user.getRole().name()
                )
        );
    }

}

