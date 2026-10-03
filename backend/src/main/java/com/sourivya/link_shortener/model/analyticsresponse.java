package com.sourivya.link_shortener.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class analyticsresponse {

    private String shortCode;
    private String originalUrl;
    private LocalDateTime createdAt;

    private int totalClicks;
    private int uniqueVisitors;

    private LocalDateTime firstClick;
    private LocalDateTime lastClick;

    private double averageClicksPerDay;

    private Map<String, Integer> browserStats;

    private Map<String, Integer> referrerStats;

    private Map<String, Integer> deviceStats;

    private Map<String, Integer> osStats;

    private List<clickresponse> clicks;


    public analyticsresponse() {
    }


    public analyticsresponse(
            String shortCode,
            String originalUrl,
            LocalDateTime createdAt,
            int totalClicks,
            int uniqueVisitors,
            LocalDateTime firstClick,
            LocalDateTime lastClick,
            double averageClicksPerDay,
            Map<String, Integer> browserStats,
            Map<String, Integer> referrerStats,
            Map<String, Integer> deviceStats,
            Map<String, Integer> osStats,
            List<clickresponse> clicks) {

        this.shortCode = shortCode;
        this.originalUrl = originalUrl;
        this.createdAt = createdAt;

        this.totalClicks = totalClicks;
        this.uniqueVisitors = uniqueVisitors;

        this.firstClick = firstClick;
        this.lastClick = lastClick;

        this.averageClicksPerDay =
                averageClicksPerDay;

        this.browserStats =
                browserStats;

        this.referrerStats =
                referrerStats;

        this.deviceStats =
                deviceStats;

        this.osStats =
                osStats;

        this.clicks = clicks;
    }


    public String getShortCode() {
        return shortCode;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public int getTotalClicks() {
        return totalClicks;
    }

    public int getUniqueVisitors() {
        return uniqueVisitors;
    }

    public LocalDateTime getFirstClick() {
        return firstClick;
    }

    public LocalDateTime getLastClick() {
        return lastClick;
    }

    public double getAverageClicksPerDay() {
        return averageClicksPerDay;
    }

    public Map<String, Integer> getBrowserStats() {
        return browserStats;
    }

    public Map<String, Integer> getReferrerStats() {
        return referrerStats;
    }

    public Map<String, Integer> getDeviceStats() {
        return deviceStats;
    }

    public Map<String, Integer> getOsStats() {
        return osStats;
    }

    public List<clickresponse> getClicks() {
        return clicks;
    }
}