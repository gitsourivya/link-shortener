package com.sourivya.link_shortener.repository;

import com.sourivya.link_shortener.model.url;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface urlrepository extends JpaRepository<url, Long> {

    Optional<url> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);
}