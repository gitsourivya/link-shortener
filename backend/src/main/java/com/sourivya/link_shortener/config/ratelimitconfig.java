package com.sourivya.link_shortener.config;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ratelimitconfig {

    private static final int MAX_REQUESTS = 10;

    private static final long WINDOW_SECONDS = 60;

    private final Map<String, Deque<Long>> requests =
            new ConcurrentHashMap<>();


    public synchronized boolean isAllowed(
            String ipAddress) {

        long now =
                Instant.now().getEpochSecond();

        long cutoff =
                now - WINDOW_SECONDS;


        Deque<Long> timestamps =
                requests.computeIfAbsent(
                        ipAddress,
                        key -> new ArrayDeque<>()
                );


        // Remove requests older than 60 seconds

        while (
                !timestamps.isEmpty() &&
                timestamps.peekFirst() < cutoff
        ) {

            timestamps.pollFirst();
        }


        // Check rate limit

        if (timestamps.size() >= MAX_REQUESTS) {

            return false;
        }


        // Record current request

        timestamps.addLast(now);

        return true;
    }
}