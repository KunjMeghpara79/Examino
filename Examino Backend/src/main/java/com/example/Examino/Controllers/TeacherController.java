package com.example.Examino.Controllers;

import com.example.Examino.DTO.CreateQuizRequest;
import com.example.Examino.DTO.OptionDTO;
import com.example.Examino.DTO.QuestionDTO;
import com.example.Examino.Services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/teacher")
public class TeacherController {


    @Autowired
    private QuizService quizService;

    @PostMapping("/create-quiz")
    public ResponseEntity<?> CreateQuiz(@RequestBody  CreateQuizRequest createQuizRequest, @RequestHeader("Authorization") String authHeader){
        return quizService.createQuiz(createQuizRequest,authHeader);
    }
    @PostMapping("/stop-quiz")
    public ResponseEntity<?> stopQuiz(@RequestBody Map<String, String> Quizcode){
        return quizService.stopQuiz(Quizcode.get("code"));
    }

    @PostMapping("/add-question")
    public ResponseEntity<?> addquestion(@RequestBody QuestionDTO questionDTO){
        return quizService.AddQuistion(questionDTO);
    }

    @PostMapping("add-option")
    public ResponseEntity<?> addoption(@RequestBody OptionDTO optionDTO){
        return quizService.AddOption(optionDTO);
    }
}
