package com.example.Examino.Services;

import com.example.Examino.DTO.CreateQuizRequest;
import com.example.Examino.DTO.OptionDTO;
import com.example.Examino.DTO.QuestionDTO;
import com.example.Examino.Entity.*;
import com.example.Examino.Enums.AttemptStatus;
import com.example.Examino.Enums.Role;
import com.example.Examino.Repositories.*;
import com.example.Examino.Security.JwtUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AttemptRepository attemptRepository;



    // 1️⃣ Create a new quiz
    @Autowired
    private QuizSchedulerService quizSchedulerService;

    public ResponseEntity<?> createQuiz(CreateQuizRequest request, String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        if(request.getStartTime().isBefore(LocalDateTime.now())){
            return new ResponseEntity<>("Enter Valid time",HttpStatus.FORBIDDEN);
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Role role = userRepository.findByEmail(auth.getName()).getRole();
        if(role == Role.STUDENT) return new ResponseEntity<>("Students can not create Questions" ,HttpStatus.FORBIDDEN);

        User teacher = userRepository.findByEmail(email);
        if (teacher == null)
            return new ResponseEntity<>("User not found", HttpStatus.FORBIDDEN);

        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setTotalMarks(request.getTotalMarks());
        quiz.setPassPercentage(request.getPassPercentage());
        quiz.setDurationMinutes(request.getDurationMinutes());
        quiz.setStartTime(request.getStartTime());
        quiz.setTeacherId(teacher.getId());
        quiz.setQuizCode(generateQuizCode());
        quiz.setActive(true);

        quizRepository.save(quiz);

        // 🔥 Schedule auto end
        quizSchedulerService.scheduleQuizEnd(quiz);

        return new ResponseEntity<>(quiz, HttpStatus.OK);
    }

    @Autowired
    private QuestionRepository questionRepository;

    public ResponseEntity<?> AddQuistion(QuestionDTO question){
        String quizid = quizRepository.findByQuizCode(question.getQuizcode()).getId();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Role role = userRepository.findByEmail(auth.getName()).getRole();
        if(role == Role.STUDENT) return new ResponseEntity<>("Students can not create Questions" ,HttpStatus.FORBIDDEN);

        if(quizid == null) return new ResponseEntity<>("Quiz does not exist",HttpStatus.FORBIDDEN);
        Question question1 = new Question();
        question1.setQuizId(quizid);
        question1.setQuestionText(question.getQuiztext());
        question1.setMarks(question.getMarks());
        questionRepository.save(question1);
        return new ResponseEntity<>(question1,HttpStatus.CREATED);
    }

    @Autowired
    private OptionRepository optionRepository;

    public ResponseEntity<?> AddOption(OptionDTO optionDTO){
        if(quizRepository.findById(optionDTO.getQuestionid()) == null)  return new ResponseEntity<>("Question does not exist",HttpStatus.FORBIDDEN);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Role role = userRepository.findByEmail(auth.getName()).getRole();
        if(role == Role.STUDENT) return new ResponseEntity<>("Students can not create Options" ,HttpStatus.FORBIDDEN);

        if (optionDTO.isCorrect() &&
                optionRepository.existsByQuestionIdAndCorrectTrue(optionDTO.getQuestionid())) {

            return new ResponseEntity<>(
                    "A correct option already exists for this question",
                    HttpStatus.BAD_REQUEST
            );
        }

        Option op = new Option();
        op.setQuestionId(optionDTO.getQuestionid());
        op.setOptionText(optionDTO.getOptiontext());
        op.setCorrect(optionDTO.isCorrect());

        optionRepository.save(op);
        return new ResponseEntity<>(op,HttpStatus.CREATED);
    }



    // 2️⃣ Fetch quizzes created by a teacher
    public List<Quiz> getQuizzesByTeacher(String teacherId) {
        return quizRepository.findByTeacherId(teacherId);
    }


    // Helper method to generate unique quiz code
    private String generateQuizCode() {
        // Generate a 6-character alphanumeric code
        String code;
        do {
            code = RandomStringUtils.randomAlphanumeric(6).toUpperCase();
        } while (quizRepository.findByQuizCode(code) != null); // ensure uniqueness
        return code;
    }
    public ResponseEntity<?> stopQuiz(String quizcode) {
        Quiz quiz = quizRepository.findByQuizCode(quizcode);
        if(quiz == null) return new ResponseEntity<>("Quiz not found", HttpStatus.FORBIDDEN);
        if(quiz.getEndTime() != null) return new ResponseEntity<>("Quiz already ended.",HttpStatus.FORBIDDEN);

        // Optional: set end time
        quiz.setEndTime(LocalDateTime.now());
        quizRepository.save(quiz);

        // Submit all active attempts
        List<Attempt> attempts = attemptRepository.findByQuizId(quizcode);
        for (Attempt attempt : attempts) {
            if (attempt.getStatus() == AttemptStatus.JOINED || attempt.getStatus() == AttemptStatus.IN_PROGRESS) {
                attempt.setStatus(AttemptStatus.SUBMITTED);
                attempt.setEndTime(LocalDateTime.now());
                attemptRepository.save(attempt);
            }
        }
    return new ResponseEntity<>(quiz,HttpStatus.OK);
    }
}
