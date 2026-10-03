package com.sourivya.link_shortener.repository;

import com.sourivya.link_shortener.model.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface userrepository
        extends JpaRepository<user, Long> {


    Optional<user> findByUsername(
            String username
    );


    Optional<user> findByEmail(
            String email
    );


    boolean existsByUsername(
            String username
    );


    boolean existsByEmail(
            String email
    );
}