package com.example.Examino;

import com.example.Examino.Services.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class MailTest {

    @Autowired
    private EmailService emailService;
    @Test
    public void mailtest(){
        emailService.sendMail("23dcs048@charusat.edu.in","sub","this is the testing mail");
    }
}
