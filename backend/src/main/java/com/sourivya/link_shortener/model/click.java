package com.sourivya.link_shortener.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clicks")
public class click {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "url_id", nullable = false)
    private url url;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String ipAddress;

    private String userAgent;

    private String referrer;

    public click() {
    }

    public click(url url) {
        this.url = url;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public url getUrl() {
        return url;
    }

    public void setUrl(url url) {
        this.url = url;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getReferrer() {
        return referrer;
    }

    public void setReferrer(String referrer) {
        this.referrer = referrer;
    }
}