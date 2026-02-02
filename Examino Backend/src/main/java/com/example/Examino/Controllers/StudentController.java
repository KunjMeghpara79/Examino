package com.example.Examino.Controllers;

import com.example.Examino.Services.AttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private AttemptService attemptService;

    @PostMapping("/join-quiz")
    public ResponseEntity<?> joinquiz(@RequestBody HashMap<String,String> code){
        return attemptService.joinQuiz(code.get("code"));
    }
}
