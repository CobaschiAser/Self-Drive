package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.dtos.ParkingDto;
import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.ParkingFlux;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import com.example.webjpademoapplicationsecondtry.exception.AlreadyBusyException;
import com.example.webjpademoapplicationsecondtry.exception.NotFoundException;
import com.example.webjpademoapplicationsecondtry.repository.ParkingFluxRepository;
import com.example.webjpademoapplicationsecondtry.repository.ParkingRepository;
import com.example.webjpademoapplicationsecondtry.repository.VehicleRepository;
import com.example.webjpademoapplicationsecondtry.service.ParkingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class ParkingServiceImpl implements ParkingService {

    private final ParkingRepository parkingRepository;
    private final ParkingFluxRepository parkingFluxRepository;

    private final VehicleRepository vehicleRepository;


    public ParkingServiceImpl(ParkingRepository parkingRepository, ParkingFluxRepository parkingFluxRepository, VehicleRepository vehicleRepository, VehicleRepository vehicleRepository1) {
        this.parkingRepository = parkingRepository;
        this.parkingFluxRepository = parkingFluxRepository;
        this.vehicleRepository = vehicleRepository1;
    }


    @Override
    public ResponseEntity<Integer> getNumberOfPages() {
        if (!parkingRepository.findAll().isEmpty()) {
            List<Parking> parkings = parkingRepository.findAll();
            int pageSize = 2;
            int numberOfPages = (int) (parkings.size() / pageSize);
            return new ResponseEntity<>(numberOfPages, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public ResponseEntity<List<Parking>> findAllParking() {
        if(!parkingRepository.findAll().isEmpty()){
            return new ResponseEntity<>(parkingRepository.findAll(), HttpStatus.OK);
        }else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }



    @Override
    public ResponseEntity<List<Parking>> findParkingByPage(Integer page){
        List<Parking> parkings = parkingRepository.findAll();
        int pageSize = 2;
        int numberOfPages = (int)(parkings.size() / pageSize) + 1;
        if (page > numberOfPages) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        List<Parking> result = new ArrayList<>();
        for (int i = (page-1) * pageSize; i< page * pageSize && i<parkings.size(); i++) {

            result.add(parkings.get(i));
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Override
    public Parking findParkingById(Long id) {
        return parkingRepository.findById(id).orElseThrow(
                () -> new NotFoundException("There is no parking with id: " + id)
        );
    }

    @Override
    public ResponseEntity<Parking> findParkingByName(String name){
        Parking parking = parkingRepository.findParkingByName(name);
        if(parking != null) {
            return new ResponseEntity<>(parking, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @Override
    public ResponseEntity<List<Vehicle>> findVehicleByParking(Long parkingId){
        Parking parking = parkingRepository.findById(parkingId).orElseThrow(
                () ->  new NotFoundException("There is no parking with id: " + parkingId)
        );
        return new ResponseEntity<>(parking.getVehicles(),HttpStatus.OK);
    }
    @Override
    public ResponseEntity<Parking> saveParking(ParkingDto parkingDto) {
        /*try {
            AppUser byUsername = appUserRepository.findUserByUsername(appUserRegisterDto.getUsername());
            AppUser byEmail = appUserRepository.findUserByEmail(appUserRegisterDto.getEmail());
            if(byUsername != null || byEmail != null) {
                return new ResponseEntity<>(null, HttpStatus.CONFLICT);
            }
            AppUser appUser = new AppUser(appUserRegisterDto);
            appUser.setSalt(passwordHashing.generateSalt());
            appUser.setPassword(passwordHashing.hashString(appUser.getPassword(), appUser.getSalt()));
            appUserRepository.save(appUser);
            return new ResponseEntity<>("User successfully Created", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
         */

        try{
            Parking byName = parkingRepository.findParkingByName(parkingDto.getName());
            Parking byCoordinates = parkingRepository.findParkingByCoord(parkingDto.getX(), parkingDto.getY());
            if(byName != null || byCoordinates != null){
                return new ResponseEntity<>(null, HttpStatus.CONFLICT);
            }
            Parking parking = new Parking(parkingDto);
            parkingRepository.save(parking);
            for(int i=0;i<30;i++){
                LocalDateTime nextDayTime = LocalDateTime.now().plusDays(i);
                java.sql.Date nextDate = java.sql.Date.valueOf(nextDayTime.toLocalDate());
                parkingFluxRepository.save(new ParkingFlux(nextDate,(long)0,(long)0,parking));
            }
            return new ResponseEntity<>(parking, HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<ResponseEntity<Parking>> saveParking(List<ParkingDto> parkings){
        List<ResponseEntity<Parking>> newParkings = new ArrayList<>();
        for(ParkingDto parking : parkings){
            newParkings.add(this.saveParking(parking));
        }
        return newParkings;
    }

        @Override
    public ResponseEntity<Parking> updateParking(ParkingDto parkingDto, Long id) {
            try {
                Parking parkingToModify = parkingRepository.findById(id).orElseThrow(
                        () -> new NotFoundException("Cannot make update operation. There is no parking with id: " + id)
                );

                if (parkingRepository.findParkingByName(parkingDto.getName()) != null && parkingRepository.findParkingByName(parkingDto.getName()) != parkingToModify) {
                    return new ResponseEntity<>(null, HttpStatus.CONFLICT);
                }

                if (parkingRepository.findParkingByCoord(parkingDto.getX(), parkingDto.getY()) != null && parkingRepository.findParkingByCoord(parkingDto.getX(), parkingDto.getY()) != parkingToModify) {
                    return new ResponseEntity<>(null, HttpStatus.CONFLICT);
                }

                parkingToModify.setName(parkingDto.getName());
                parkingToModify.setX(parkingDto.getX());
                parkingToModify.setY(parkingDto.getY());
                parkingToModify.setMaxCapacity(parkingDto.getMaxCapacity());
                parkingRepository.save(parkingToModify);
                return new ResponseEntity<>(parkingToModify, HttpStatus.OK);
            }catch(Exception e){
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    @Override
    public void deleteParkingById(Long id) {
        parkingRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Cannot make delete operation. There is no parking with id: " + id)
        ); // firstly, we assure that there is a parking with given id
        parkingRepository.deleteById(id);
    }

    @Override
    public boolean checkFreeSpace(Parking parking){
        return parking.getMaxCapacity() - parking.getCurrentCapacity() > 0;
    }

    @Override
    public void addVehicleToParking(Long parkingId, Long vehicleId){
        Parking finalParking = this.findParkingById(parkingId);
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(
               () -> new NotFoundException("false")
        );

        if(!checkFreeSpace(finalParking)){
            throw new AlreadyBusyException("No free space in this parking, choose another one");
        }

        // verify if vehicle was previously mapped to another parking and
        // updated it according to that
        Parking initialParking = vehicle.getCurrentParking();
        if(initialParking != null) {
            initialParking.setCurrentCapacity(initialParking.getCurrentCapacity() - 1);
            initialParking.removeVehicle(vehicle);
            this.parkingRepository.save(initialParking);
        }

        finalParking.setCurrentCapacity(finalParking.getCurrentCapacity() + 1);
        finalParking.addVehicle(vehicle);
        this.parkingRepository.save(finalParking);
        vehicle.setCurrentParking(finalParking);
        vehicleRepository.save(vehicle);
    }


    @Override
    public void removeVehicleFromParking(Long parkingId, Long vehicleId){
        Parking parking = this.findParkingById(parkingId);
        if(parking != null) {
           boolean found = false;
           for(Vehicle v : parking.getVehicles()) {
               if (v.getId() == vehicleId) {
                   found = true;
                   parking.removeVehicle(v);
                   parking.setCurrentCapacity(parking.getCurrentCapacity() - 1);
                   this.parkingRepository.save(parking);
                   v.setCurrentParking(null);
                   //v.setBusy(false);
                   this.vehicleRepository.save(v);
                   break;
               }
           }
           if(!found) {
               throw new NotFoundException("There is no vehicle with id: " + vehicleId + " in parking " + parking.getName());
           }
        }else {
            throw  new NotFoundException("There is no parking with id: " + parkingId);
        }
    }

    @Override
    public ResponseEntity<Parking> findParkingByVehicleId(Long id){

        Parking parking = parkingRepository.findParkingByVehicleId(id);
        if(parking != null) {
            return new ResponseEntity<>(parking, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }



}
