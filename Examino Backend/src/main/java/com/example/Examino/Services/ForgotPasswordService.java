package com.example.Examino.Services;

import com.example.Examino.Entity.User;
import com.example.Examino.Repositories.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.Random;

@Service
public class ForgotPasswordService {


    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private PasswordEncoder  passwordEncoder;

    public ResponseEntity<?> sendotp(String email) throws MessagingException {
        User user = userRepository.findByEmail(email);
        if(user == null) return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);


        Random random=new Random();
        int number=random.nextInt(1000000); // 0 to 999999
        String randomSixDigit=String.format("%06d",number);
        System.out.println(randomSixDigit);


        String body = "<!DOCTYPE html>"
                + "<html>"
                + "<body style='font-family:Arial,sans-serif;background-color:#f4f6f8;padding:20px;'>"

                + "<div style='max-width:500px;margin:auto;background:white;"
                + "padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"

                + "<h2 style='color:#333;text-align:center;'>Password Reset Request</h2>"

                + "<p>Hello,</p>"
                + "<p>We received a request to reset your password.</p>"

                + "<div style='text-align:center;margin:20px 0;'>"
                + "<span style='font-size:24px;font-weight:bold;"
                + "letter-spacing:4px;color:#2c7be5;'>"
                + randomSixDigit
                + "</span>"
                + "</div>"

                + "<p>This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.</p>"

                + "<hr style='border:none;border-top:1px solid #eee;margin:20px 0;'>"

                + "<p style='font-size:12px;color:#888;text-align:center;'>"
                + "Regards,<br>Support Team"
                + "</p>"

                + "</div>"
                + "</body>"
                + "</html>";

        emailService.sendMail(email,"Reset Password",body);
        stringRedisTemplate.opsForValue().set(
                email,
                randomSixDigit,
                Duration.ofSeconds(30)
        );




        return ResponseEntity.ok(Map.of("message", "OTP Sent!"));

    }

    public ResponseEntity<?> verifyotp(String otp,String email) {
        String s = stringRedisTemplate.opsForValue().get(email);

        User user = userRepository.findByEmail(email);
        if(user == null){
            return new ResponseEntity<>("user not found" ,HttpStatus.FORBIDDEN);
        }
        if(otp == null || otp.isBlank()){
            return new ResponseEntity<>("Otp is null" , HttpStatus.FORBIDDEN);
        }
        if(email == null || email.isBlank()){
            return new ResponseEntity<>("email not found",HttpStatus.FORBIDDEN);
        }

        if(s.equals(otp)){
            return ResponseEntity.ok(Map.of("message","otp verified"));
        }
        else{
            return new ResponseEntity<>(Map.of("message","Invalid OTP"),HttpStatus.FORBIDDEN);
        }
    }

    public ResponseEntity<?> resetpassword(String email,String password){

        User user = userRepository.findByEmail(email);
        if(user == null) return new ResponseEntity<>(Map.of("message","User does not exist"),HttpStatus.FORBIDDEN);

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return new ResponseEntity<>(Map.of("message","Password updated"),HttpStatus.OK);

    }

}
