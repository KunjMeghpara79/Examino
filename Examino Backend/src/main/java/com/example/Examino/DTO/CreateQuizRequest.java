package com.example.Examino.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateQuizRequest {
    private String title;
    private String description;
    private int totalMarks;
    private int passPercentage;
    private int durationMinutes;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;


}

