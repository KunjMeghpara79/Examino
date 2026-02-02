package com.example.Examino.Services;

import com.example.Examino.Entity.Attempt;
import com.example.Examino.Entity.Violation;
import com.example.Examino.Enums.AttemptStatus;
import com.example.Examino.Enums.ViolationType;
import com.example.Examino.Repositories.AttemptRepository;
import com.example.Examino.Repositories.ViolationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ViolationService {

    @Autowired
    private ViolationRepository violationRepository;

    @Autowired
    private AttemptRepository attemptRepository;

    // 1️⃣ Log a violation for a student attempt
    public Violation logViolation(String attemptId, ViolationType type) {
        // Check if attempt exists and is in progress
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        if (attempt.getStatus() == AttemptStatus.REMOVED || attempt.getStatus() == AttemptStatus.SUBMITTED) {
            throw new RuntimeException("Cannot log violation. Attempt is closed or removed.");
        }

        // Create violation record
        Violation violation = new Violation();
        violation.setAttemptId(attemptId);
        violation.setType(type);
        violation.setTimestamp(LocalDateTime.now());

        // Increment violation count in attempt
        int currentCount = Objects.requireNonNullElse(attempt.getViolationCount(), 0);
        attempt.setViolationCount(currentCount + 1);

        attemptRepository.save(attempt);

        return violationRepository.save(violation);
    }

    // 2️⃣ Fetch all violations for an attempt (used by teacher dashboard)
    public List<Violation> getViolationsByAttempt(String attemptId) {
        return violationRepository.findByAttemptId(attemptId);
    }

    // 3️⃣ Fetch all violations for a student (optional)
    public List<Violation> getViolationsByStudent(String studentId) {
        List<Attempt> attempts = attemptRepository.findByStudentId(studentId);
        List<Violation> allViolations = new ArrayList<>();
        for (Attempt a : attempts) {
            allViolations.addAll(violationRepository.findByAttemptId(a.getId()));
        }
        return allViolations;
    }
}
