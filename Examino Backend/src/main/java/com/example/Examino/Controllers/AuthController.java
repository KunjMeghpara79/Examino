package com.example.Examino.Controllers;

import com.example.Examino.DTO.CreateUserRequest;
import com.example.Examino.DTO.LoginRequest;
import com.example.Examino.Services.AuthService;
import com.example.Examino.Services.ConfirmPasswordService;
import com.example.Examino.Services.ForgotPasswordService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private ConfirmPasswordService confirmPasswordService;

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        return authService.createUser(request);
    }

    @PostMapping("/sendotp")
    public ResponseEntity<?> sendotp(@RequestBody  Map<String,String> body) throws MessagingException {
        confirmPasswordService.sendOtp(body.get("email"));
        return ResponseEntity.ok(Map.of("message","OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verify(@RequestBody  Map<String,String> body){
        return confirmPasswordService.verifyotp(body.get("email"),body.get("otp"));
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
