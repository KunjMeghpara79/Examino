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
public class ForgotPasswordService {


    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    public ResponseEntity<?> sendotp(String email){
        User user = userRepository.findByEmail(email);
        if(user == null) return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);


        Random random=new Random();
        int number=random.nextInt(1000000); // 0 to 999999
        String randomSixDigit=String.format("%06d",number);
        System.out.println(randomSixDigit);


        String body = "Hello,\n\n"
                + "We received a request to reset your password.\n\n"
                + "Your OTP is: " + randomSixDigit + "\n\n"
                + "This OTP is valid for 10 minutes. Please do not share it with anyone.\n\n"
                + "Regards,\n"
                + "Support Team";

        stringRedisTemplate.opsForValue().set(
                email,
                randomSixDigit,
                Duration.ofSeconds(30)
        );


        emailService.sendMail(email,"Reset Password",body);

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
            return new ResponseEntity<>("invalid otp",HttpStatus.FORBIDDEN);
        }
    }

}
