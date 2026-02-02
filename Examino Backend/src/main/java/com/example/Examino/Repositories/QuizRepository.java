package com.example.Examino.Repositories;

import com.example.Examino.Entity.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByTeacherId(String teacherId);
    Quiz findByQuizCode(String quizCode);
}
