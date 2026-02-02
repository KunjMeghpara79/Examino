package com.example.Examino.Services;

import com.example.Examino.Entity.Answer;
import com.example.Examino.Entity.Attempt;
import com.example.Examino.Enums.AttemptStatus;
import com.example.Examino.Repositories.AnswerRepository;
import com.example.Examino.Repositories.AttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private AttemptRepository attemptRepository;

    // 1️⃣ Save or update a student's answer
    public Answer saveAnswer(String attemptId, String questionId, String selectedOptionId) {
        // Check if attempt exists and is in progress
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        if (attempt.getStatus() == AttemptStatus.REMOVED || attempt.getStatus() == AttemptStatus.SUBMITTED) {
            throw new RuntimeException("Cannot save answer. Attempt is closed or removed.");
        }

        // Check if answer already exists for this question
        Optional<Answer> existing = answerRepository.findByAttemptId(attemptId).stream()
                .filter(a -> a.getQuestionId().equals(questionId))
                .findFirst();

        Answer answer;
        if (existing.isPresent()) {
            // Update existing answer
            answer = existing.get();
            answer.setSelectedOptionId(selectedOptionId);
        } else {
            // Create new answer
            answer = new Answer();
            answer.setAttemptId(attemptId);
            answer.setQuestionId(questionId);
            answer.setSelectedOptionId(selectedOptionId);
        }

        return answerRepository.save(answer);
    }

    // 2️⃣ Fetch all answers for an attempt (used for scoring or review)
    public List<Answer> getAnswersByAttempt(String attemptId) {
        return answerRepository.findByAttemptId(attemptId);
    }

    // 3️⃣ Fetch single answer for a question (optional, for frontend)
    public Answer getAnswerByQuestion(String attemptId, String questionId) {
        return answerRepository.findByAttemptId(attemptId).stream()
                .filter(a -> a.getQuestionId().equals(questionId))
                .findFirst()
                .orElse(null);
    }

}

