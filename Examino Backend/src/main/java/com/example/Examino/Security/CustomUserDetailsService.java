package com.example.Examino.Security;

import com.example.Examino.Entity.User;
import com.example.Examino.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

/**
 * Spring Security DOES NOT know how to read MongoDB.
 *
 * This class teaches Spring Security:
 * "How to load a user from database"
 */
@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;



    /**
     * Called automatically by Spring Security
     * during authentication & JWT validation
     */
    @Override
    public UserDetails loadUserByUsername(String email) {

        /**
         * Fetch user from MongoDB using email
         */
        User user = null;
        try {
            user = userRepository
                    .findByEmail(email);
            if(user == null) throw new RuntimeException("user not found");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        /**
         * Convert our User entity into
         * Spring Security's UserDetails object
         */
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}