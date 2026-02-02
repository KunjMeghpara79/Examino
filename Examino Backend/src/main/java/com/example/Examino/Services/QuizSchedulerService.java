package com.example.Examino.Services;

import com.example.Examino.Entity.Quiz;
import com.example.Examino.Repositories.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service // Marks this class as a Spring service component
public class QuizSchedulerService {

    @Autowired
    private QuizRepository quizRepository;

    /*
     * Thread pool used to schedule background tasks.
     * 5 threads means 5 quizzes can be handled in parallel.
     */
    private final ScheduledExecutorService scheduler =
            Executors.newScheduledThreadPool(10);

    /*
     * Schedules automatic quiz termination
     * This method is called immediately after quiz creation
     */
    public void scheduleQuizEnd(Quiz quiz) {

        /*
         * Calculate delay time (in milliseconds)
         * delay = (quiz start time + duration) - current time
         * This tells scheduler when the quiz should end
         */
        long delay = Duration.between(
                LocalDateTime.now(),
                quiz.getStartTime().plusMinutes(quiz.getDurationMinutes())
        ).toMillis();

        /*
         * Schedule a task that will run AFTER the calculated delay
         */
        scheduler.schedule(() -> {

            /*
             * Fetch latest quiz data from DB
             * (important in case quiz was modified meanwhile)
             */
            Quiz q = quizRepository.findById(quiz.getId()).orElse(null);

            /*
             * If quiz exists AND is still active,
             * then end the quiz automatically
             */
            if (q != null && q.isActive()) {

                // Set actual end time when quiz finishes
                q.setEndTime(LocalDateTime.now());

                // Mark quiz as inactive (cannot be joined anymore)
                q.setActive(false);

                // Save updated quiz state to MongoDB
                quizRepository.save(q);
            }

        }, delay, TimeUnit.MILLISECONDS); // Run after "delay" milliseconds
    }
}
