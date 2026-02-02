package com.example.Examino.Repositories;

import com.example.Examino.Entity.Option;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OptionRepository extends MongoRepository<Option, String> {
    List<Option> findByQuestionId(String questionId);
    boolean existsByQuestionIdAndCorrectTrue(String questionId);
}
