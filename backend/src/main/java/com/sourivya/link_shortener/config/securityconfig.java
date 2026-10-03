package com.sourivya.link_shortener.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class securityconfig {

    private final jwtfilter jwtFilter;

    public securityconfig(
            jwtfilter jwtFilter) {

        this.jwtFilter =
                jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // Enable CORS

                .cors(cors -> {})

                // Disable CSRF for REST API

                .csrf(csrf ->
                        csrf.disable()
                )

                // JWT authentication is stateless

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Allow OPTIONS preflight requests

                .authorizeHttpRequests(auth ->
                        auth
                                .requestMatchers(
                                        org.springframework.http.HttpMethod.OPTIONS,
                                        "/**"
                                )
                                .permitAll()

                                .requestMatchers(
                                        "/api/auth/register"
                                )
                                .permitAll()

                                .requestMatchers(
                                        "/api/auth/login"
                                )
                                .permitAll()

                                .requestMatchers(
                                        "/api/links/**"
                                )
                                .authenticated()

                                .anyRequest()
                                .permitAll()
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}