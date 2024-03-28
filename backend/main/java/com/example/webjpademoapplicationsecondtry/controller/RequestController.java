package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.helpers.InputDate;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.service.RequestService;
import com.example.webjpademoapplicationsecondtry.service.RideService;
import com.example.webjpademoapplicationsecondtry.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/request")
public class RequestController {

    @Autowired
    private final RequestService requestService;

    @Autowired
    private final RideService rideService;

    @Autowired
    private final VehicleService vehicleService;

    public RequestController(RequestService requestService, RideService rideService, VehicleService vehicleService) {
        this.requestService = requestService;
        this.rideService = rideService;
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public List<Request> findAllRequest(){
        return requestService.findAllRequest();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Request> findRequestById(@PathVariable("id") Long id){
        return requestService.findRequestById(id);
    }

    @GetMapping("/by-date")
    public List<Request> findRequestByDate(@RequestBody InputDate date){
        Date sqlDate = Date.valueOf(date.getYear() + "-" + date.getMonth() + "-" + date.getDay());
        return requestService.findRequestByDate(sqlDate);
    }

    @PostMapping("/{uuid}")
    public Request saveRequest(@RequestBody Request request,@PathVariable("uuid") UUID uuid){
        return requestService.saveRequest(request, uuid, vehicleService);
    }

    @PostMapping("/{id}/start")
    public void startRequest(@PathVariable("id") Long id){
        requestService.startRequest(id);
    }

    @PostMapping("{id}/finish")
    public void finishRequest(@PathVariable("id") Long id){

        requestService.finishRequest(id);
        rideService.saveRide(id);
    }

    @PutMapping("/{id}")
    public Request modifyRequest(@RequestBody Request request, @PathVariable("id") Long id){
        return requestService.updateRequest(request, id, vehicleService);
    }

    @DeleteMapping("/{id}")
    public void deleteRequestById(@PathVariable("id") Long id){
        requestService.deleteRequestById(id);
    }

}
