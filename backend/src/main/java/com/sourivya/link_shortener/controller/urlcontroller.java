package com.sourivya.link_shortener.controller;

import com.sourivya.link_shortener.config.ratelimitconfig;
import com.sourivya.link_shortener.model.analyticsresponse;
import com.sourivya.link_shortener.model.errorresponse;
import com.sourivya.link_shortener.model.url;
import com.sourivya.link_shortener.service.urlservice;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class urlcontroller {

    private final urlservice urlService;

    private final ratelimitconfig rateLimitConfig;


    public urlcontroller(
            urlservice urlService,
            ratelimitconfig rateLimitConfig) {

        this.urlService = urlService;

        this.rateLimitConfig =
                rateLimitConfig;
    }


    // Create short URL

    @PostMapping("/api/links")
    public ResponseEntity<?> createShortUrl(

            @RequestParam String originalUrl,

            @RequestParam(required = false)
            String customAlias,

            @RequestParam(required = false)
            Integer expirationDays,

            HttpServletRequest request) {


        // Get user's IP address

        String ipAddress =
                request.getRemoteAddr();


        // Check rate limit

        if (!rateLimitConfig.isAllowed(
                ipAddress)) {

            return ResponseEntity
                    .status(
                            HttpStatus.TOO_MANY_REQUESTS
                    )
                    .body(
                            new errorresponse(
                                    "Too many requests. Please try again in a minute."
                            )
                    );
        }


        // Create short URL

        url createdUrl =
                urlService.createShortUrl(

                        originalUrl,

                        customAlias,

                        expirationDays
                );


        return ResponseEntity.ok(
                createdUrl
        );
    }


    // Get all shortened URLs

    @GetMapping("/api/links")
    public ResponseEntity<List<url>> getAllUrls() {

        return ResponseEntity.ok(
                urlService.getAllUrls()
        );
    }


    // Redirect to original URL

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirectToOriginalUrl(

            @PathVariable String shortCode,

            HttpServletRequest request) {


        String ipAddress =
                request.getRemoteAddr();


        String userAgent =
                request.getHeader(
                        "User-Agent"
                );


        String referrer =
                request.getHeader(
                        "Referer"
                );


        url foundUrl =
                urlService.getUrlByShortCode(

                        shortCode,

                        ipAddress,

                        userAgent,

                        referrer
                );


        return ResponseEntity
                .status(302)
                .header(
                        "Location",
                        foundUrl.getOriginalUrl()
                )
                .build();
    }


    // Get analytics

    @GetMapping(
            "/api/links/{shortCode}/analytics"
    )
    public ResponseEntity<analyticsresponse>
    getAnalytics(

            @PathVariable String shortCode) {


        analyticsresponse analytics =
                urlService.getAnalytics(
                        shortCode
                );


        return ResponseEntity.ok(
                analytics
        );
    }


    // Delete shortened URL

    @DeleteMapping(
            "/api/links/{shortCode}"
    )
    public ResponseEntity<Void>
    deleteShortUrl(

            @PathVariable String shortCode) {


        urlService.deleteShortUrl(
                shortCode
        );


        return ResponseEntity
                .noContent()
                .build();
    }
}