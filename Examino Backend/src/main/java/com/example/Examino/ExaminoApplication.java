package com.example.Examino;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ExaminoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExaminoApplication.class, args);
	}

}
