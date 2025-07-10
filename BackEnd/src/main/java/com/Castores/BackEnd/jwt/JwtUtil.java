package com.Castores.BackEnd.jwt;

import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.ExpiredJwtException;

import java.util.Base64;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;
@Component
public class JwtUtil {

    private final JwtConfig jwtConfig;
    private SecretKey key;

    public JwtUtil(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    @PostConstruct
    public void init() {
        try {
            byte[] decoded = Base64.getDecoder().decode(jwtConfig.getSecret());
            if (decoded.length < 32) {
                throw new IllegalArgumentException("La clave JWT debe tener al menos 256 bits (32 bytes)");
            }
            this.key = Keys.hmacShaKeyFor(decoded);
        } catch (Exception e) {
            throw new RuntimeException("Error al inicializar la clave JWT: " + e.getMessage(), e);
        }
    }

    public String generarAccessToken(String subject, Map<String, Object> claims) {
        return Jwts.builder()
        	.setIssuer(jwtConfig.getIssuer())
            .setAudience(jwtConfig.getAudience())
            .setSubject(subject)
            .addClaims(claims)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getAccessExpiration()))
            .signWith(key)
            .compact();
    }

    public String generarRefreshToken(String subject) {
        return Jwts.builder()
            .setIssuer(jwtConfig.getIssuer())
            .setAudience(jwtConfig.getAudience())
            .setSubject(subject)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getRefreshExpiration()))
            .signWith(key)
            .compact();
    }

    public String getSubject(String token) {
        return Jwts.parserBuilder()
            .requireIssuer(jwtConfig.getIssuer())
            .requireAudience(jwtConfig.getAudience())
            .setAllowedClockSkewSeconds(60) // opcional
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder()
            	.requireIssuer(jwtConfig.getIssuer())
            	.requireAudience(jwtConfig.getAudience())
                .setAllowedClockSkewSeconds(60)
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException  e) {
            System.out.println("❌ Token expirado: " + e.getMessage());
            return false;
        } catch (JwtException e) {
            System.out.println("Token inválido: " + e.getMessage());
            return false;
        }
    }
}
