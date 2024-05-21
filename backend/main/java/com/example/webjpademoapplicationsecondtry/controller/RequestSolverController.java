package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.utils.InputDate;
import com.example.webjpademoapplicationsecondtry.service.RequestSolverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;

@RestController
@CrossOrigin(origins = "http://localhost:2810")
@RequestMapping("/request-solver")
public class RequestSolverController {
    @Autowired
    private final RequestSolverService requestSolverService;

    public RequestSolverController(RequestSolverService requestSolverService) {
        this.requestSolverService = requestSolverService;
    }

    @PutMapping("/solve/by-date")
    public void solveRequestByDate(@RequestBody InputDate date){
        Date sqlDate = Date.valueOf(date.getYear() + "-" + date.getMonth() + "-" + date.getDay());
        requestSolverService.solveRequests(sqlDate);
    }
}
