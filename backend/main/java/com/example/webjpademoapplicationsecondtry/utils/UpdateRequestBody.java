package com.example.webjpademoapplicationsecondtry.utils;

import com.example.webjpademoapplicationsecondtry.entity.Request;

import java.util.UUID;

public class UpdateRequestBody {
    private Request request;
    private UUID userId;

    public UpdateRequestBody(){}

    public UpdateRequestBody(Request r, UUID userId){
        this.request = r;
        this.userId = userId;
    }

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
