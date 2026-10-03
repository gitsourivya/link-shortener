package com.sourivya.link_shortener.repository;

import com.sourivya.link_shortener.model.click;
import com.sourivya.link_shortener.model.url;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface clickrepository extends JpaRepository<click, Long> {

    List<click> findByUrl(url url);

    void deleteByUrl(url url);
}