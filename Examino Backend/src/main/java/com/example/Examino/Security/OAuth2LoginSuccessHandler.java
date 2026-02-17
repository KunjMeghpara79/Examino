package com.example.Examino.Security;

import com.example.Examino.Enums.Role;
import com.example.Examino.Entity.User;
import com.example.Examino.Repositories.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    @Lazy
    private JwtUtil jwtUtil;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userRepository.findByEmail(email);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setRole(Role.STUDENT); // Default role
            user.setPassword(""); // No password for OAuth users
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        // Redirect with encoded parameters to avoid issues with spaces or special characters
        try {
            String redirectUrl = String.format("%s/oauth2/callback?token=%s&name=%s&email=%s&role=%s",
                frontendUrl,
                java.net.URLEncoder.encode(token, "UTF-8"),
                java.net.URLEncoder.encode(name, "UTF-8"),
                java.net.URLEncoder.encode(email, "UTF-8"),
                java.net.URLEncoder.encode(user.getRole().name(), "UTF-8")
            );
            response.sendRedirect(redirectUrl);
        } catch (java.io.UnsupportedEncodingException e) {
            // Should not happen with UTF-8
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Encoding error");
        }

    }
}
