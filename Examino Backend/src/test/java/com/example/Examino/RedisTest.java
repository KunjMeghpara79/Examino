package com.example.Examino;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.time.Duration;

@SpringBootTest
public class RedisTest {

    @Autowired
    private StringRedisTemplate redisTemplate;


    @Test
    public void redtest(){
        redisTemplate.opsForValue().set(
                "Kunj",
                "2005",
                Duration.ofSeconds(30)
        );
        String storedOtp=redisTemplate.opsForValue().get("Kunj");
        System.out.println(storedOtp);
    }
}
