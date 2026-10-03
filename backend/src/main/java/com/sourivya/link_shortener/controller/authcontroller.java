package com.sourivya.link_shortener.controller;

import com.sourivya.link_shortener.model.authresponse;
import com.sourivya.link_shortener.model.user;
import com.sourivya.link_shortener.service.authservice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class authcontroller {

    private final authservice authService;


    public authcontroller(
            authservice authService) {

        this.authService =
                authService;
    }


    // Register

    @PostMapping("/register")
    public ResponseEntity<authresponse> register(

            @RequestParam String username,

            @RequestParam String email,

            @RequestParam String password) {


        user newUser =
                authService.register(

                        username,

                        email,

                        password
                );


        authresponse response =
                new authresponse(

                        newUser.getId(),

                        newUser.getUsername(),

                        newUser.getEmail()
                );


        return ResponseEntity.ok(
                response
        );
    }


    // Login

    @PostMapping("/login")
    public ResponseEntity<String> login(

            @RequestParam String username,

            @RequestParam String password) {


        String token =
                authService.login(

                        username,

                        password
                );


        return ResponseEntity.ok(
                token
        );
    }
}