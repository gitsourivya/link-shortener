package com.sourivya.link_shortener.service;

import com.sourivya.link_shortener.model.user;
import com.sourivya.link_shortener.repository.userrepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class authservice {

    private final userrepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final jwtservice jwtService;


    public authservice(
            userrepository userRepository,
            PasswordEncoder passwordEncoder,
            jwtservice jwtService) {

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;

        this.jwtService =
                jwtService;
    }


    // Register a new user

    public user register(
            String username,
            String email,
            String password) {


        // Validate username

        if (username == null ||
                username.trim().isEmpty()) {

            throw new RuntimeException(
                    "Username cannot be empty"
            );
        }


        // Validate email

        if (email == null ||
                email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Email cannot be empty"
            );
        }


        // Validate password

        if (password == null ||
                password.length() < 6) {

            throw new RuntimeException(
                    "Password must contain at least 6 characters"
            );
        }


        username =
                username.trim();

        email =
                email.trim().toLowerCase();


        // Check duplicate username

        if (userRepository.existsByUsername(
                username)) {

            throw new RuntimeException(
                    "Username already exists"
            );
        }


        // Check duplicate email

        if (userRepository.existsByEmail(
                email)) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }


        // Hash password

        String hashedPassword =
                passwordEncoder.encode(
                        password
                );


        // Create user

        user newUser =
                new user(
                        username,
                        email,
                        hashedPassword
                );


        return userRepository.save(
                newUser
        );
    }


    // Login

    public String login(
            String username,
            String password) {


        // Find user

        user foundUser =
                userRepository
                        .findByUsername(
                                username
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid username or password"
                                )
                        );


        // Verify password

        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        foundUser.getPassword()
                );


        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid username or password"
            );
        }


        // Generate JWT

        return jwtService.generateToken(
                foundUser
        );
    }
}