package com.example.Examino.Repositories;

import com.example.Examino.Entity.Answer;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AnswerRepository extends MongoRepository<Answer, String> {
    List<Answer> findByAttemptId(String attemptId);
}
