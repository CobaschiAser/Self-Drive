package com.example.webjpademoapplicationsecondtry.service;

import com.example.webjpademoapplicationsecondtry.entity.Request;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;


public interface RequestSolverService {
    public void solveRequests(Date date);
}
