package com.example.Examino.Services;

import com.example.Examino.Entity.User;
import com.example.Examino.Repositories.UserRepository;
import jakarta.mail.MessagingException;
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

    public void sendOtp(String to) throws MessagingException {
        Random random=new Random();
        int number=random.nextInt(1000000); // 0 to 999999
        String randomSixDigit=String.format("%06d",number);
        System.out.println(randomSixDigit);


        User user = new User();
        user.setEmail(to);
        user.setOtp(randomSixDigit);

        String emailBody=String.format(
                "<div style='font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;'>"
                        + "  <div style='max-width:500px; margin:0 auto; background:#ffffff; padding:30px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1);'>"
                        + "    <h2 style='color:#2c3e50; text-align:center;'>Email Verification</h2>"
                        + "    <p style='font-size:15px; color:#555;'>Hello User,</p>"
                        + "    <p style='font-size:15px; color:#555;'>Thank you for signing up with <strong>Examino</strong>.</p>"
                        + "    <p style='font-size:15px; color:#555;'>Your verification code is:</p>"
                        + "    <div style='text-align:center; margin:25px 0;'>"
                        + "       <span style='display:inline-block; font-size:32px; font-weight:bold; color:#ffffff; background-color:#007bff; padding:12px 25px; border-radius:8px; letter-spacing:3px;'>%s</span>"
                        + "    </div>"
                        + "    <p style='font-size:14px; color:#777;'>Please enter this code to verify your email address.</p>"
                        + "    <p style='font-size:14px; color:#777;'>This code will expire in <strong>10 minutes</strong>.</p>"
                        + "    <hr style='margin:25px 0; border:none; border-top:1px solid #eee;'>"
                        + "    <p style='font-size:13px; color:#999;'>If you did not create this account, please ignore this email.</p>"
                        + "    <p style='font-size:14px; color:#555;'>Regards,<br><strong>Examino Team</strong></p>"
                        + "  </div>"
                        + "</div>",
                randomSixDigit
        );

        emailService.sendMail(to,"Account Registration – Please Confirm Your Email",emailBody);
        redisTemplate.opsForValue().set(
                to,
                randomSixDigit,
                Duration.ofSeconds(60)
        );


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
        return new ResponseEntity<>(Map.of("message", "Invalid OTP"),HttpStatus.NOT_FOUND);

    }


}
