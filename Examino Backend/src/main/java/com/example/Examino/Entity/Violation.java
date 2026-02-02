package com.example.Examino.Entity;

import com.example.Examino.Enums.ViolationType;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
@Data
@Document(collection = "violations")
public class Violation {
    @Id
    private String id;
    private String attemptId;
    private ViolationType type;
    private LocalDateTime timestamp = LocalDateTime.now();
}