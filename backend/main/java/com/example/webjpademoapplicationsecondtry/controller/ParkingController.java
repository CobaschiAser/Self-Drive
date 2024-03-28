package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.dtos.ParkingDto;
import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import com.example.webjpademoapplicationsecondtry.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/parking")
public class ParkingController {
    @Autowired
    private final ParkingService parkingService;

    public ParkingController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }


    @GetMapping
    public ResponseEntity<List<Parking>> findAllParking(){
        return parkingService.findAllParking();
    }

    /*@GetMapping("/pageNumber")
    public ResponseEntity<Integer> getNumberOfPages() { return parkingService.getNumberOfPages();}

    @GetMapping("/getPage")
    public ResponseEntity<List<Parking>> findParkingByPage(@RequestParam Integer page){
        return parkingService.findParkingByPage(page);
    }*/

    @GetMapping("/getByVehicle/{id}")
    public ResponseEntity<Parking> findParkingByVehicleId(@PathVariable("id") Long id){
        return parkingService.findParkingByVehicleId(id);
    }

    @GetMapping("/byId/{id}")
    public Parking findParkingById(@PathVariable("id") Long id){
        return parkingService.findParkingById(id);
    }

    @GetMapping("/byName/{name}")
    public ResponseEntity<Parking> findParkingByName(@PathVariable("name") String name){
        return parkingService.findParkingByName(name);
    }

    @GetMapping("/{id}/vehicles")
    public ResponseEntity<List<Vehicle>> findVehicleByParking(@PathVariable("id") Long id){
        return parkingService.findVehicleByParking(id);
    }
    @PostMapping
    public ResponseEntity<Parking> saveParking(@RequestBody ParkingDto parking){
        return parkingService.saveParking(parking);
    }

    @PostMapping("/all")
    public List<ResponseEntity<Parking>> saveParking(@RequestBody List<ParkingDto> parkings){
        return parkingService.saveParking(parkings);
    }

    @PutMapping("/{parkingId}/addVehicle/{vehicleId}")
    public void addVehicle(@PathVariable("parkingId") Long parkingId, @PathVariable("vehicleId") Long vehicleId){
        parkingService.addVehicleToParking(parkingId, vehicleId);
    }

    @PutMapping("/{parkingId}/removeVehicle/{vehicleId}")
    public void removeVehicle(@PathVariable("parkingId") Long parkingId, @PathVariable("vehicleId") Long vehicleId){
        parkingService.removeVehicleFromParking(parkingId, vehicleId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Parking> update(@RequestBody ParkingDto parkingDto, @PathVariable("id") Long id){
        return parkingService.updateParking(parkingDto, id);
    }


    @DeleteMapping("/{id}")
    public void deleteParkingById(@PathVariable("id") Long id){
        parkingService.deleteParkingById(id);
    }

}
