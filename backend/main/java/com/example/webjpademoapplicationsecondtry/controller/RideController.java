package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.Ride;
import com.example.webjpademoapplicationsecondtry.service.RideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/ride")
public class RideController {
    @Autowired
    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }


    @GetMapping
    public List<Ride> findAllParking(){
        return rideService.findAllRide();
    }


    @GetMapping("/{id}")
    public Ride findRideById(@PathVariable ("id") Long id){
        return rideService.findRideById(id);
    }

}
