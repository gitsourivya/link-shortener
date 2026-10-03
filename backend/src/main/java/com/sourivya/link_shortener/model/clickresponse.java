package com.sourivya.link_shortener.model;

import java.time.LocalDateTime;

public class clickresponse {

    private Long id;
    private LocalDateTime timestamp;
    private String ipAddress;
    private String userAgent;
    private String referrer;

    public clickresponse() {
    }

    public clickresponse(
            Long id,
            LocalDateTime timestamp,
            String ipAddress,
            String userAgent,
            String referrer) {

        this.id = id;
        this.timestamp = timestamp;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.referrer = referrer;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public String getReferrer() {
        return referrer;
    }
}