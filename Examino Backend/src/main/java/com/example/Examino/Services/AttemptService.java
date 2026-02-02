package com.example.Examino.Services;

import com.example.Examino.Entity.*;
import com.example.Examino.Enums.AttemptStatus;
import com.example.Examino.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttemptService {

    @Autowired
    private AttemptRepository attemptRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    // 1️⃣ Student joins a quiz using quiz code
    public ResponseEntity<?> joinQuiz(String quizCode) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        String studentId= userRepository.findByEmail(email).getId();
        Quiz quiz = quizRepository.findByQuizCode(quizCode);
        if(LocalDateTime.now().isAfter(quiz.getStartTime()))return new ResponseEntity<>("Quiz already started",HttpStatus.FORBIDDEN);
        if(quiz == null) return new ResponseEntity<>("Quiz not found", HttpStatus.FORBIDDEN);

        if(quiz.getEndTime() != null) return new ResponseEntity<>("Quiz is already Ended.",HttpStatus.FORBIDDEN);

        // Optional: Check if student already joined
        boolean alreadyJoined = attemptRepository.findByQuizId(quiz.getId()).stream()
                .anyMatch(a -> a.getStudentId().equals(studentId) && a.getStatus() != AttemptStatus.REMOVED);

        if (alreadyJoined) {
            return new ResponseEntity<>("You have already Joined the quiz",HttpStatus.FORBIDDEN);
        }

        Attempt attempt = new Attempt();
        attempt.setQuizId(quiz.getId());
        attempt.setStudentId(studentId);
        attempt.setStatus(AttemptStatus.JOINED);
        attempt.setStartTime(LocalDateTime.now());
        attempt.setViolationCount(0);

        attemptRepository.save(attempt);
        return new ResponseEntity<>(attempt + "Joined the quiz succesfully",HttpStatus.OK);
    }

    // 2️⃣ Kick / Remove student
    public void kickStudent(String attemptId) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));
        attempt.setStatus(AttemptStatus.REMOVED);
        attempt.setEndTime(LocalDateTime.now());
        attemptRepository.save(attempt);
    }

    // 3️⃣ Submit attempt (manual or auto)
    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    public Attempt submitAttempt(String attemptId) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        attempt.setStatus(AttemptStatus.SUBMITTED);
        attempt.setEndTime(LocalDateTime.now());

        // Calculate score
        List<Answer> answers = answerRepository.findByAttemptId(attemptId);
        int totalScore = 0;

        for (Answer answer : answers) {
            Option selectedOption = optionRepository.findById(answer.getSelectedOptionId())
                    .orElse(null);

            if (selectedOption != null && selectedOption.isCorrect()) {
                // Get marks of the question
                Question question = questionRepository.findById(answer.getQuestionId())
                        .orElse(null);
                if (question != null) {
                    totalScore += question.getMarks();
                }
            }
        }

        // Update attempt with score, percentage, pass/fail
        attempt.setScore(totalScore);

        Quiz quiz = quizRepository.findById(attempt.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        double percentage = ((double) totalScore / quiz.getTotalMarks()) * 100;
        attempt.setPercentage(percentage);
        attempt.setPassed(percentage >= quiz.getPassPercentage());

        return attemptRepository.save(attempt);
    }

    // 4️⃣ Fetch all attempts for a quiz (used by teacher)
    public List<Attempt> getAttemptsByQuiz(String quizId) {
        return attemptRepository.findByQuizId(quizId);
    }

    // 5️⃣ Fetch all attempts for a student (used for history)
    public List<Attempt> getAttemptsByStudent(String studentId) {
        return attemptRepository.findByStudentId(studentId);
    }
}
