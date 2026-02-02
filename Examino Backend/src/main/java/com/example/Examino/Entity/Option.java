package com.example.Examino.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Data
@Document(collection = "options")
public class Option {
    @Id
    private String id;
    private String questionId;
    private String optionText;
    private boolean correct;
}