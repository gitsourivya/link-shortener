package com.sourivya.link_shortener.service;

import com.sourivya.link_shortener.model.user;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class jwtservice {

    @Value("${jwt.secret}")
    private String secretKey;

    private static final long EXPIRATION_TIME =
            1000L * 60 * 60 * 24;

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                secretKey.getBytes(
                        StandardCharsets.UTF_8
                )
        );
    }

    public String generateToken(user user) {

        Date now =
                new Date();

        Date expiration =
                new Date(
                        now.getTime()
                                + EXPIRATION_TIME
                );

        return Jwts.builder()
                .subject(
                        user.getUsername()
                )
                .issuedAt(
                        now
                )
                .expiration(
                        expiration
                )
                .signWith(
                        getSigningKey()
                )
                .compact();
    }
}