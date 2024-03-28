package com.example.webjpademoapplicationsecondtry.service;

import com.example.webjpademoapplicationsecondtry.dtos.ParkingDto;
import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ParkingService {
    public ResponseEntity<List<Parking>> findAllParking();
    public Parking findParkingById(Long id);

    public ResponseEntity<List<Parking>> findParkingByPage(Integer page);

    public ResponseEntity<Integer> getNumberOfPages();

    public ResponseEntity<Parking> findParkingByName(String name);
    public ResponseEntity<Parking> findParkingByVehicleId(Long id);

    public ResponseEntity<List<Vehicle>> findVehicleByParking(Long parkingId);
    public ResponseEntity<Parking> saveParking(ParkingDto parkingDto);

    public List<ResponseEntity<Parking>> saveParking(List<ParkingDto> parkings);

    public ResponseEntity<Parking> updateParking(ParkingDto parkingDto, Long id);

    public void deleteParkingById(Long id);

    public boolean checkFreeSpace(Parking parking);

    public void addVehicleToParking(Long parkingId, Long vehicleId);

    public void removeVehicleFromParking(Long parkingId, Long vehicleId);
}
