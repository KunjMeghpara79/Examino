package com.example.Examino.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET="examino-secret-key-1234567890123456";

    // 7 days
    private static final long EXPIRATION=1000L*60*60*24*7;

    /**
     * Generate JWT token
     */
    public String generateToken(String username,String role){

        return Jwts.builder()
                .setSubject(username)
                .claim("role",role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+EXPIRATION))
                .signWith(
                        Keys.hmacShaKeyFor(SECRET.getBytes()),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }

    /**
     * Extract username
     */
    public String extractUsername(String token){
        return getClaims(token).getSubject();
    }

    /**
     * Extract role
     */
    public String extractRole(String token){
        return getClaims(token).get("role",String.class);
    }

    /**
     * Validate token (signature + username + expiry)
     */
    public boolean validateToken(String token,String username){
        try{
            Claims claims=Jwts.parserBuilder()
                    .setSigningKey(SECRET.getBytes())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String extractedUsername=claims.getSubject();
            Date expiration=claims.getExpiration();

            return extractedUsername.equals(username)
                    && expiration.after(new Date());

        }catch(Exception e){
            return false;
        }
    }

    /**
     * Parse claims (used internally)
     */
    private Claims getClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(SECRET.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
