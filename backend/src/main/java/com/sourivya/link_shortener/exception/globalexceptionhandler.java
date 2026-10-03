package com.sourivya.link_shortener.exception;

import com.sourivya.link_shortener.model.errorresponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class globalexceptionhandler {


    // Handle invalid requests

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<errorresponse> handleRuntimeException(
            RuntimeException exception) {

        errorresponse response =
                new errorresponse(
                        exception.getMessage()
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }


    // Handle unexpected errors

    @ExceptionHandler(Exception.class)
    public ResponseEntity<errorresponse> handleException(
            Exception exception) {

        errorresponse response =
                new errorresponse(
                        "Something went wrong"
                );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
}