package com.example.Examino.Entity;

import com.example.Examino.Enums.AttemptStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
@Data
@Document(collection = "attempts")
public class Attempt {
    @Id
    private String id;
    private String quizId;
    private String studentId;
    private AttemptStatus status;
    private int score;
    private double percentage;
    private Boolean passed;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int violationCount;
}