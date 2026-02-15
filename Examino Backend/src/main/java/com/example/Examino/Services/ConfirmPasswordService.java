package com.example.Examino.Services;

import com.example.Examino.Entity.User;
import com.example.Examino.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.Random;

@Service
public class ConfirmPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private StringRedisTemplate redisTemplate;

    public void sendOtp(String to){
        Random random=new Random();
        int number=random.nextInt(1000000); // 0 to 999999
        String randomSixDigit=String.format("%06d",number);
        System.out.println(randomSixDigit);


        User user = new User();
        user.setEmail(to);
        user.setOtp(randomSixDigit);

        String emailBody=String.format(
                "Hello %s,\n\n"+
                        "Thank you for signing up.\n"+
                        "Your verification code is: %s\n\n"+
                        "Please enter this code to verify your email address.\n"+
                        "This code will expire in 10 minutes.\n\n"+
                        "If you did not create this account, please ignore this email.\n\n"+
                        "Regards,\n"+
                        "Examino Team",
                user.getName(),randomSixDigit
        );
        redisTemplate.opsForValue().set(
                to,
                randomSixDigit,
                Duration.ofSeconds(30)
        );

        emailService.sendMail(to,"Account Registration – Please Confirm Your Email",emailBody);
    }

    public ResponseEntity<?> verifyotp(String email, String otp) {

        // 1. Basic validation
        if (email == null || email.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email is required"));
        }

        if (otp == null || otp.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "OTP is required"));
        }


        String storedOtp=redisTemplate.opsForValue().get(email);



        if(otp.equals(storedOtp)){
            // 5. Success
            return ResponseEntity.ok(Map.of("message", "OTP verified"));
        }
        return new ResponseEntity<>("OTP not found",HttpStatus.NOT_FOUND);
    }


}
