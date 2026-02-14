package com.example.Examino.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
/**
 * Central security configuration class
 *
 * DEFINES:
 * - Which APIs are public
 * - Which APIs need authentication
 * - Which roles can access what
 */
@Configuration
@EnableMethodSecurity // Enables @PreAuthorize
public class SecurityConfig {

    public PasswordEncoder passwordEncoder() {
        // Strength 10 is default and safe
        return new BCryptPasswordEncoder();
    }
    private final JwtFilter jwtFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    public SecurityConfig(JwtFilter jwtFilter, OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler) {
        this.jwtFilter = jwtFilter;
        this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
    }

    /**
     * SecurityFilterChain replaces old WebSecurityConfigurerAdapter
     */
    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http) throws Exception {

        http
                /**
                 * Disable CSRF
                 * Required for stateless REST APIs
                 */
                .csrf(csrf -> csrf.disable())

                /**
                 * Disable session creation
                 * JWT = Stateless authentication
                 */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS))

                /**
                 * Authorization rules
                 */
                .authorizeHttpRequests(auth -> auth

                        // Public endpoints
                        .requestMatchers("/auth/**").permitAll()

                        // Admin-only endpoints
                        .requestMatchers("/quiz/**")
                        .hasRole("TEACHER")

                        // All other APIs need authentication
                        .anyRequest().authenticated()
                )

                /**
                 * Add JWT filter BEFORE Spring's auth filter
                 */
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2LoginSuccessHandler)
                );

        return http.build();

    }
}