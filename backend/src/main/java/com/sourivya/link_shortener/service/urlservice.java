package com.sourivya.link_shortener.service;

import com.sourivya.link_shortener.model.analyticsresponse;
import com.sourivya.link_shortener.model.click;
import com.sourivya.link_shortener.model.clickresponse;
import com.sourivya.link_shortener.model.url;
import com.sourivya.link_shortener.model.user;
import com.sourivya.link_shortener.repository.clickrepository;
import com.sourivya.link_shortener.repository.urlrepository;
import com.sourivya.link_shortener.repository.userrepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class urlservice {

    private final urlrepository urlRepository;
    private final clickrepository clickRepository;
    private final userrepository userRepository;

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static final int CODE_LENGTH = 6;

    private final SecureRandom random = new SecureRandom();


    // Constructor

    public urlservice(
            urlrepository urlRepository,
            clickrepository clickRepository,
            userrepository userRepository) {

        this.urlRepository = urlRepository;
        this.clickRepository = clickRepository;
        this.userRepository = userRepository;
    }


    // Get currently logged-in user

    private user getCurrentUser() {

        String username =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"
                        )
                );
    }


    // Create a short URL

    public url createShortUrl(
            String originalUrl,
            String customAlias,
            Integer expirationDays) {

        // Validate URL

        if (originalUrl == null ||
                originalUrl.trim().isEmpty()) {

            throw new RuntimeException(
                    "URL cannot be empty"
            );
        }

        originalUrl = originalUrl.trim();

        try {

            java.net.URI uri =
                    new java.net.URI(originalUrl);

            String scheme =
                    uri.getScheme();

            String host =
                    uri.getHost();

            if (scheme == null ||
                    host == null ||
                    (!scheme.equalsIgnoreCase("http") &&
                     !scheme.equalsIgnoreCase("https"))) {

                throw new RuntimeException(
                        "Please enter a valid HTTP or HTTPS URL"
                );
            }

        } catch (java.net.URISyntaxException exception) {

            throw new RuntimeException(
                    "Please enter a valid URL"
            );
        }


        String shortCode;


        // Custom alias

        if (customAlias != null &&
                !customAlias.trim().isEmpty()) {

            customAlias = customAlias.trim();


            // Validate alias characters

            if (!customAlias.matches(
                    "[a-zA-Z0-9_-]+")) {

                throw new RuntimeException(
                        "Custom alias can only contain letters, numbers, hyphens, and underscores"
                );
            }


            // Check reserved aliases

            String aliasLower =
                    customAlias.toLowerCase();


            if (
                    aliasLower.equals("api") ||
                    aliasLower.equals("links") ||
                    aliasLower.equals("dashboard") ||
                    aliasLower.equals("admin") ||
                    aliasLower.equals("login") ||
                    aliasLower.equals("register") ||
                    aliasLower.equals("health") ||
                    aliasLower.equals("error") ||
                    aliasLower.equals("favicon.ico")
            ) {

                throw new RuntimeException(
                        "This custom alias is reserved and cannot be used"
                );
            }


            // Check duplicate alias

            if (urlRepository.existsByShortCode(
                    customAlias)) {

                throw new RuntimeException(
                        "Custom alias already exists"
                );
            }


            shortCode = customAlias;

        } else {

            // Generate random short code

            do {

                shortCode =
                        generateShortCode();

            } while (
                    urlRepository.existsByShortCode(
                            shortCode)
            );
        }


        // Create URL entity

        url newUrl =
                new url(
                        originalUrl,
                        shortCode
                );


        // Assign URL to logged-in user

        user currentUser =
                getCurrentUser();

        newUrl.setUser(
                currentUser
        );


        // Set expiration

        if (expirationDays != null &&
                expirationDays > 0) {

            newUrl.setExpiresAt(
                    LocalDateTime.now()
                            .plusDays(
                                    expirationDays
                            )
            );
        }


        return urlRepository.save(
                newUrl
        );
    }


    // Get all shortened URLs belonging to logged-in user

    public List<url> getAllUrls() {

        user currentUser =
                getCurrentUser();

        return urlRepository
                .findAll()
                .stream()
                .filter(link ->
                        link.getUser() != null &&
                        link.getUser()
                                .getId()
                                .equals(
                                        currentUser.getId()
                                )
                )
                .toList();
    }


    // Find URL and record click

    public url getUrlByShortCode(
            String shortCode,
            String ipAddress,
            String userAgent,
            String referrer) {

        url foundUrl =
                urlRepository
                        .findByShortCode(
                                shortCode
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Short URL not found"
                                )
                        );


        // Check expiration

        if (foundUrl.getExpiresAt() != null &&
                foundUrl.getExpiresAt()
                        .isBefore(
                                LocalDateTime.now()
                        )) {

            throw new RuntimeException(
                    "This short URL has expired"
            );
        }


        // Create click record

        click newClick =
                new click(foundUrl);


        newClick.setIpAddress(
                ipAddress
        );

        newClick.setUserAgent(
                userAgent
        );

        newClick.setReferrer(
                referrer
        );


        clickRepository.save(
                newClick
        );


        return foundUrl;
    }


    // Get analytics

    public analyticsresponse getAnalytics(
            String shortCode) {

        url foundUrl =
                urlRepository
                        .findByShortCode(
                                shortCode
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Short URL not found"
                                )
                        );


        // Make sure the URL belongs to logged-in user

        user currentUser =
                getCurrentUser();

        if (foundUrl.getUser() == null ||
                !foundUrl.getUser()
                        .getId()
                        .equals(
                                currentUser.getId()
                        )) {

            throw new RuntimeException(
                    "You do not have permission to view this link"
            );
        }


        // Get all clicks

        List<click> clicks =
                clickRepository.findByUrl(
                        foundUrl
                );


        // Convert clicks to response objects

        List<clickresponse> clickResponses =
                clicks.stream()
                        .map(click ->
                                new clickresponse(
                                        click.getId(),
                                        click.getTimestamp(),
                                        click.getIpAddress(),
                                        click.getUserAgent(),
                                        click.getReferrer()
                                )
                        )
                        .toList();


        // Total clicks

        int totalClicks =
                clickResponses.size();


        // Unique visitors

        int uniqueVisitors =
                (int) clicks.stream()
                        .map(click ->
                                click.getIpAddress()
                        )
                        .filter(ip ->
                                ip != null &&
                                !ip.isBlank()
                        )
                        .distinct()
                        .count();


        // Browser statistics

        Map<String, Integer> browserStats =
                new LinkedHashMap<>();


        for (click click : clicks) {

            String userAgent =
                    click.getUserAgent();

            String browser =
                    detectBrowser(userAgent);


            browserStats.put(
                    browser,
                    browserStats.getOrDefault(
                            browser,
                            0
                    ) + 1
            );
        }


        // Referrer statistics

        Map<String, Integer> referrerStats =
                new LinkedHashMap<>();


        for (click click : clicks) {

            String referrer =
                    click.getReferrer();

            String source =
                    detectReferrer(referrer);


            referrerStats.put(
                    source,
                    referrerStats.getOrDefault(
                            source,
                            0
                    ) + 1
            );
        }


        // Device statistics

        Map<String, Integer> deviceStats =
                new LinkedHashMap<>();


        for (click click : clicks) {

            String userAgent =
                    click.getUserAgent();

            String device =
                    detectDevice(userAgent);


            deviceStats.put(
                    device,
                    deviceStats.getOrDefault(
                            device,
                            0
                    ) + 1
            );
        }


        // Operating system statistics

        Map<String, Integer> osStats =
                new LinkedHashMap<>();


        for (click click : clicks) {

            String userAgent =
                    click.getUserAgent();

            String operatingSystem =
                    detectOperatingSystem(
                            userAgent
                    );


            osStats.put(
                    operatingSystem,
                    osStats.getOrDefault(
                            operatingSystem,
                            0
                    ) + 1
            );
        }


        // First and last click

        LocalDateTime firstClick = null;

        LocalDateTime lastClick = null;


        if (!clicks.isEmpty()) {

            firstClick =
                    clicks.stream()
                            .map(click ->
                                    click.getTimestamp()
                            )
                            .min(
                                    LocalDateTime::compareTo
                            )
                            .orElse(null);


            lastClick =
                    clicks.stream()
                            .map(click ->
                                    click.getTimestamp()
                            )
                            .max(
                                    LocalDateTime::compareTo
                            )
                            .orElse(null);
        }


        // Calculate average clicks per day

        double averageClicksPerDay = 0;


        if (firstClick != null &&
                lastClick != null) {

            long days =
                    Duration.between(
                            firstClick,
                            lastClick
                    ).toDays();


            if (days == 0) {

                averageClicksPerDay =
                        totalClicks;

            } else {

                averageClicksPerDay =
                        (double) totalClicks /
                                days;
            }
        }


        // Return analytics

        return new analyticsresponse(
                foundUrl.getShortCode(),
                foundUrl.getOriginalUrl(),
                foundUrl.getCreatedAt(),
                totalClicks,
                uniqueVisitors,
                firstClick,
                lastClick,
                averageClicksPerDay,
                browserStats,
                referrerStats,
                deviceStats,
                osStats,
                clickResponses
        );
    }


    // Detect browser from User-Agent

    private String detectBrowser(
            String userAgent) {

        if (userAgent == null ||
                userAgent.isBlank()) {

            return "Unknown";
        }


        String agent =
                userAgent.toLowerCase();


        if (agent.contains("edg")) {

            return "Edge";
        }


        if (agent.contains("opr") ||
                agent.contains("opera")) {

            return "Opera";
        }


        if (agent.contains("chrome") &&
                !agent.contains("edg")) {

            return "Chrome";
        }


        if (agent.contains("firefox")) {

            return "Firefox";
        }


        if (agent.contains("safari") &&
                !agent.contains("chrome")) {

            return "Safari";
        }


        return "Other";
    }


    // Detect device from User-Agent

    private String detectDevice(
            String userAgent) {

        if (userAgent == null ||
                userAgent.isBlank()) {

            return "Unknown";
        }


        String agent =
                userAgent.toLowerCase();


        if (agent.contains("tablet") ||
                agent.contains("ipad")) {

            return "Tablet";
        }


        if (agent.contains("mobile") ||
                agent.contains("android") ||
                agent.contains("iphone")) {

            return "Mobile";
        }


        return "Desktop";
    }


    // Detect operating system from User-Agent

    private String detectOperatingSystem(
            String userAgent) {

        if (userAgent == null ||
                userAgent.isBlank()) {

            return "Unknown";
        }


        String agent =
                userAgent.toLowerCase();


        if (agent.contains("windows")) {

            return "Windows";
        }


        if (agent.contains("mac os") ||
                agent.contains("macintosh")) {

            return "macOS";
        }


        if (agent.contains("android")) {

            return "Android";
        }


        if (agent.contains("iphone") ||
                agent.contains("ipad") ||
                agent.contains("ios")) {

            return "iOS";
        }


        if (agent.contains("linux")) {

            return "Linux";
        }


        return "Other";
    }


    // Detect traffic source

    private String detectReferrer(
            String referrer) {

        if (referrer == null ||
                referrer.isBlank()) {

            return "Direct";
        }


        String source =
                referrer.toLowerCase();


        if (source.contains("google.")) {

            return "Google";
        }


        if (source.contains("instagram.com")) {

            return "Instagram";
        }


        if (source.contains("facebook.com") ||
                source.contains("fb.com")) {

            return "Facebook";
        }


        if (source.contains("youtube.com")) {

            return "YouTube";
        }


        if (source.contains("twitter.com") ||
                source.contains("x.com")) {

            return "X";
        }


        if (source.contains("linkedin.com")) {

            return "LinkedIn";
        }


        return "Other";
    }


    // Delete shortened URL

    @Transactional
    public void deleteShortUrl(
            String shortCode) {

        url foundUrl =
                urlRepository
                        .findByShortCode(
                                shortCode
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Short URL not found"
                                )
                        );


        // Make sure the URL belongs to logged-in user

        user currentUser =
                getCurrentUser();

        if (foundUrl.getUser() == null ||
                !foundUrl.getUser()
                        .getId()
                        .equals(
                                currentUser.getId()
                        )) {

            throw new RuntimeException(
                    "You do not have permission to delete this link"
            );
        }


        // Delete click records first

        clickRepository.deleteByUrl(
                foundUrl
        );


        // Delete shortened URL

        urlRepository.delete(
                foundUrl
        );
    }


    // Generate random short code

    private String generateShortCode() {

        StringBuilder code =
                new StringBuilder(
                        CODE_LENGTH
                );


        for (int i = 0;
             i < CODE_LENGTH;
             i++) {

            int index =
                    random.nextInt(
                            CHARACTERS.length()
                    );


            code.append(
                    CHARACTERS.charAt(index)
            );
        }


        return code.toString();
    }
}