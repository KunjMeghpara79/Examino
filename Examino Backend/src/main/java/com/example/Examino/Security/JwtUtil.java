package com.example.Examino.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;
/**
 * JwtUtil is a helper/utility class.
 *
 * RESPONSIBILITIES:
 * 1. Generate JWT token after successful login
 * 2. Extract user information (email, role) from token
 * 3. Validate token signature and expiry
 *
 * WHY THIS CLASS EXISTS:
 * - JWT logic should NOT be inside controllers
 * - Keeps authentication logic reusable and clean
 */
@Component // Makes this class a Spring Bean
public class JwtUtil {

    /**
     * SECRET KEY used to SIGN the JWT.
     *
     * IMPORTANT:
     * - If someone gets this key, they can forge tokens
     * - Should be LONG (>= 256 bits for HS256)
     * - In production → store in environment variable
     */
    private static final String SECRET =
            "examino-secret-key-1234567890123456";

    /**
     * Token expiration time
     * Here: 5 hours
     *
     * WHY EXPIRY IS IMPORTANT:
     * - Prevents infinite access if token is stolen
     * - Forces re-login after time
     */
    // 1000 ms * 60 sec * 60 min * 24 hours * 7 days
    private static final long EXPIRATION = 1000L * 60 * 60 * 24 * 7;


    /**
     * Generates JWT token
     *
     * @param username -> email of user
     * @param role     -> ADMIN or STUDENT
     * @return JWT token as String
     */
    public String generateToken(String username, String role) {

        /**
         * Jwts.builder() creates a JWT builder
         */
        return Jwts.builder()

                // SUBJECT = unique identifier of user
                .setSubject(username)

                // Custom claim: role
                // This helps authorization without DB hit
                .claim("role", role)

                // Token creation time
                .setIssuedAt(new Date())

                // Token expiration time
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION)
                )

                // Sign token using secret key + algorithm
                .signWith(
                        Keys.hmacShaKeyFor(SECRET.getBytes()),
                        SignatureAlgorithm.HS256
                )

                // Build final compact JWT string
                .compact();
    }

    /**
     * Extracts username (email) from JWT token
     */
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Extracts role from JWT token
     */
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    /**
     * Parses JWT and extracts all claims
     *
     * WHAT THIS DOES INTERNALLY:
     * - Verifies token signature
     * - Checks expiration
     * - Throws exception if token is invalid
     */
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}