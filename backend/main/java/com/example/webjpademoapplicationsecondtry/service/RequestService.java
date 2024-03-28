package com.example.webjpademoapplicationsecondtry.service;

import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.helpers.UpdateRequestBody;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

public interface RequestService {
    public ResponseEntity<Request> findRequestById(Long id);

    public List<Request> findAllRequest();

    public List<Request> findRequestByDate(Date date);


    public Request saveRequest(Request request, UUID userId, VehicleService vehicleService);

    public Request updateRequest(Request request, Long id, VehicleService vehicleService);
    public void deleteRequestById(Long id);

    //public void safeDeleteRequest(Long id);

    public void deleteOnlyRequest(Long id);

    public void startRequest(Long id);

    public void finishRequest(Long id);
    



}
