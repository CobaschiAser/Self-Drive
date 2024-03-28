package com.example.webjpademoapplicationsecondtry.service;


import com.example.webjpademoapplicationsecondtry.entity.Vehicle;

import java.sql.Date;
import java.util.List;

public interface VehicleService {
    public List<Vehicle> findAllVehicle();

    public  List<Vehicle> willBeInDeparture(String departure, Date date, Integer startHour, String vehicleType);

    public List<Vehicle> willBeInDepartureUpdate(String departure, Date date, Integer startHour,Long initialVehicleId, String vehicleType);
    public Vehicle findVehicleById(Long id);

    public Vehicle saveVehicle(Vehicle vehicle);

    public List<Vehicle> saveAllVehicle(List<Vehicle> vehicleEntities);

    public Vehicle updateVehicle(Vehicle vehicle, Long id);

    public void deleteVehicleById(Long id, ParkingService parkingService);

}
