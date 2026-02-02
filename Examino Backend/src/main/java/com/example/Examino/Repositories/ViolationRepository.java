package com.example.Examino.Repositories;

import com.example.Examino.Entity.Violation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ViolationRepository extends MongoRepository<Violation, String> {
    List<Violation> findByAttemptId(String attemptId);
}
