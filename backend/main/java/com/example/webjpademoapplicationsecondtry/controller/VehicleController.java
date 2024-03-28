package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.dtos.VehicleMatchRequestDto;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import com.example.webjpademoapplicationsecondtry.service.ParkingService;
import com.example.webjpademoapplicationsecondtry.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/vehicle")
public class VehicleController {
    private final VehicleService vehicleService;

    private final ParkingService parkingService;


    @Autowired
    public VehicleController(VehicleService vehicleService, ParkingService parkingService) {
        this.vehicleService = vehicleService;
        this.parkingService = parkingService;
    }

    @GetMapping
    public List<Vehicle> findAllVehicle(){
        return vehicleService.findAllVehicle();
    }

    @GetMapping("/available-in-departure")
    public List<Vehicle> availableVehicle(@RequestParam String departure, @RequestParam String date, @RequestParam Integer startHour, @RequestParam String vehicleType){
        Date convertedDate = Date.valueOf(date);
        return vehicleService.willBeInDeparture(departure, convertedDate, startHour, vehicleType);
    }

    @GetMapping("/available-in-departure-update")
    public List<Vehicle> availableVehicleUpdate(@RequestParam String departure, @RequestParam String date, @RequestParam Integer startHour,@RequestParam Long initialVehicleId, @RequestParam String vehicleType){
        Date convertedDate = Date.valueOf(date);
        return vehicleService.willBeInDepartureUpdate(departure, convertedDate, startHour,initialVehicleId, vehicleType);
    }

    @GetMapping("/{id}")
    public Vehicle findVehicleById(@PathVariable("id") Long id) {

        return vehicleService.findVehicleById(id);
    }

    @PostMapping
    public Vehicle saveVehicle(@RequestBody Vehicle vehicle){
        return vehicleService.saveVehicle(vehicle);
    }

    @PostMapping("/all")
    public List<Vehicle> saveAllVehicle(@RequestBody List<Vehicle> vehicles) {
        return vehicleService.saveAllVehicle(vehicles);
    }



    @PutMapping("/{id}")
    public Vehicle update(@RequestBody Vehicle vehicle, @PathVariable("id") Long id){
        return vehicleService.updateVehicle(vehicle, id);
    }

    @DeleteMapping("/{id}")
    public void deleteVehicleById(@PathVariable("id") Long id){
        vehicleService.deleteVehicleById(id, parkingService);
    }

}
