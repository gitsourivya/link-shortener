package com.sourivya.link_shortener.model;

public class errorresponse {

    private String message;

    public errorresponse() {
    }

    public errorresponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}