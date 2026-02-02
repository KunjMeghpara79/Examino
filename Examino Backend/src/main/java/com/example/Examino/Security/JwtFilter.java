package com.example.Examino.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


/**
 * JwtFilter runs ONCE for EVERY HTTP request.
 *
 * RESPONSIBILITY:
 * - Check Authorization header
 * - Validate JWT token
 * - Set authenticated user in Spring Security Context
 *
 * WITHOUT THIS CLASS:
 * ❌ JWT token would never be checked
 * ❌ All APIs would be unsecured
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil,
                     CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * This method executes for EVERY request
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws ServletException, IOException {

        /**
         * Read Authorization header
         * Expected format:
         * Authorization: Bearer <JWT_TOKEN>
         */
        String authHeader = request.getHeader("Authorization");

        // Check if header exists and starts correctly
        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            // Extract token by removing "Bearer "
            String token = authHeader.substring(7);

            // Extract username (email) from token
            String username = jwtUtil.extractUsername(token);

            /**
             * Load user details from DB
             * Needed by Spring Security for role checking
             */
            UserDetails userDetails =
                    null;
            try {
                userDetails = userDetailsService
                        .loadUserByUsername(username);
            } catch (UsernameNotFoundException e) {
                throw new RuntimeException(e);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

            /**
             * Create Authentication object
             *
             * UsernamePasswordAuthenticationToken means:
             * "This user is authenticated"
             */
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, // no credentials needed
                            userDetails.getAuthorities()
                    );

            // Attach request details (IP, session, etc.)
            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            /**
             * VERY IMPORTANT:
             * Store authentication in SecurityContext
             *
             * After this:
             * - Spring knows user is logged in
             * - @PreAuthorize works
             */
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);
        }

        // Continue filter chain
        chain.doFilter(request, response);
    }
}