package com.example.webjpademoapplicationsecondtry.service;

import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Ride;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

public interface RideService {
    public Ride findRideById(Long id);
    public List<Ride> findAllRide();
    public List<Ride> findRideByDate(Date date);
    public Ride saveRide(Long id);

    //public Ride updateRide(Ride ride, Long id);

    //public void deleteRideById(Long id);
}
