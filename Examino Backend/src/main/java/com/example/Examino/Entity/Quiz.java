package com.example.Examino.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "quizzes")
public class Quiz {
    @Id
    private String id;
    private String title;
    private String description;
    private String quizCode;
    private String teacherId;
    private int totalMarks;
    private int passPercentage;
    private int durationMinutes;
    private LocalDateTime startTime;
    private boolean active = true;
    private LocalDateTime endTime;
    private LocalDateTime createdAt = LocalDateTime.now();
}
