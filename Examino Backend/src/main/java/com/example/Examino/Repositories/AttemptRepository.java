package com.example.Examino.Repositories;


import com.example.Examino.Entity.Attempt;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AttemptRepository extends MongoRepository<Attempt, String> {
    List<Attempt> findByQuizId(String quizId);
    List<Attempt> findByStudentId(String studentId);
}