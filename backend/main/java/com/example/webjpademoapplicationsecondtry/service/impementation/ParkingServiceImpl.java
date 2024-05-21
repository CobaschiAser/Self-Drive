package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.dtos.ParkingDto;
import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.ParkingFlux;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import com.example.webjpademoapplicationsecondtry.exception.AlreadyBusyException;
import com.example.webjpademoapplicationsecondtry.exception.NotFoundException;
import com.example.webjpademoapplicationsecondtry.service.VehicleService;
import com.example.webjpademoapplicationsecondtry.utils.JwtUtil;
import com.example.webjpademoapplicationsecondtry.utils.PercentageConverter;
import com.example.webjpademoapplicationsecondtry.utils.PeriodConverter;
import com.example.webjpademoapplicationsecondtry.repository.ParkingFluxRepository;
import com.example.webjpademoapplicationsecondtry.repository.ParkingRepository;
import com.example.webjpademoapplicationsecondtry.repository.RequestRepository;
import com.example.webjpademoapplicationsecondtry.repository.VehicleRepository;
import com.example.webjpademoapplicationsecondtry.service.ParkingService;
import io.jsonwebtoken.Jwt;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.sql.Date;
import java.util.*;


@Service
public class ParkingServiceImpl implements ParkingService {

    private final ParkingRepository parkingRepository;
    private final ParkingFluxRepository parkingFluxRepository;

    private final VehicleRepository vehicleRepository;

    private final RequestRepository requestRepository;


    public ParkingServiceImpl(ParkingRepository parkingRepository, ParkingFluxRepository parkingFluxRepository, VehicleRepository vehicleRepository, VehicleRepository vehicleRepository1, RequestRepository requestRepository) {
        this.parkingRepository = parkingRepository;
        this.parkingFluxRepository = parkingFluxRepository;
        this.vehicleRepository = vehicleRepository1;
        this.requestRepository = requestRepository;
    }

    @Override
    public ResponseEntity<List<Long>> findParkingStatistics(String token, Integer all, Long id, String period){

        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        Date date = PeriodConverter.convertPeriodToDate(period);
        if (all == 1) {
            List<Request> requestList = requestRepository.findAll();
            Long totalRequest = (long)requestList.size();
            for (Request request: requestList) {
                if (request.getDate().before(date)) {
                    totalRequest --;
                }
            }
            Long totalInput = (long)0;
            Long totalOutput = (long)0;
            List<ParkingFlux> parkingFluxList = parkingFluxRepository.findAll();
            for (ParkingFlux parkingFlux : parkingFluxList) {
                if (parkingFlux.getDate().after(date)) {
                    totalInput += parkingFlux.getInput();
                    totalOutput += parkingFlux.getOutput();
                }
            }
            return new ResponseEntity<>(Arrays.asList(totalRequest, totalInput, totalOutput), HttpStatus.OK);
        } else {
            String parkingName = parkingRepository.findParkingById(id).getName();
            List<Request> requestList = requestRepository.findRequestByParking(parkingName);
            Long totalRequest = (long)requestList.size();
            for (Request request: requestList) {
                if (request.getDate().before(date)) {
                    totalRequest --;
                }
            }
            Long totalInput = (long)0;
            Long totalOutput = (long)0;
            List<ParkingFlux> parkingFluxList = parkingFluxRepository.findByParkingId(id);
            for (ParkingFlux parkingFlux : parkingFluxList) {
                if (parkingFlux.getDate().after(date)) {
                    totalInput += parkingFlux.getInput();
                    totalOutput += parkingFlux.getOutput();
                }
            }
            return new ResponseEntity<>(Arrays.asList(totalRequest, totalInput, totalOutput), HttpStatus.OK);
        }
    }



    @Override
    public ResponseEntity<Map<Long, Long>> findParkingHierarchy(String token, String period) {
        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        Map<Long, Long> myMap = new HashMap<>();
        List<Parking> parkings = parkingRepository.findAll();

        final Integer NOT_ALL = 0;

        Long sumAll = 0L;

        for (Parking parking : parkings) {
            List<Long> parkingStatistics = this.findParkingStatistics(token, NOT_ALL, parking.getId(), period).getBody();
            if (parkingStatistics != null) {
                Long output = parkingStatistics.get(parkingStatistics.size() - 1);
                sumAll += output;
                myMap.put(parking.getId(), output);
            }
        }

        List<Vehicle> vehiclesCanBeMoved = vehicleRepository.findAll();
        vehiclesCanBeMoved.removeIf(vehicle -> !requestRepository.findActiveRequestWithVehicle(vehicle.getId()).isEmpty());
        Long nrVehiclesCanBeMoved = (long) vehiclesCanBeMoved.size();

        for (Parking parking : parkings) {
            Long output = myMap.get(parking.getId());
            double percentage = PercentageConverter.getPercentage(sumAll, output);
            Long newKey = PercentageConverter.getAmount(nrVehiclesCanBeMoved, percentage);
            myMap.put(parking.getId(), newKey);
        }

        // Sort myMap by value
        List<Map.Entry<Long, Long>> entryList = new ArrayList<>(myMap.entrySet());
        entryList.sort(Map.Entry.comparingByValue());

        // Create a new LinkedHashMap to preserve the sorted order
        Map<Long, Long> sortedMap = new LinkedHashMap<>();
        for (Map.Entry<Long, Long> entry : entryList) {
            sortedMap.put(entry.getKey(), entry.getValue());
        }

        return new ResponseEntity<>(sortedMap, HttpStatus.OK);
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
    public ResponseEntity<List<Parking>> findAllParking(String token) {

        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        if (!parkingRepository.findAll().isEmpty()) {
            return new ResponseEntity<>(parkingRepository.findAll(), HttpStatus.OK);
        } else {
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
    public ResponseEntity<Parking> findParkingById(String token, Long id) {
        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        Parking parking = parkingRepository.findParkingById(id);
        return new ResponseEntity<>(parking, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Parking> findParkingByName(String token, String name){

        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        Parking parking = parkingRepository.findParkingByName(name);
        if(parking != null) {
            return new ResponseEntity<>(parking, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @Override
    public ResponseEntity<List<Vehicle>> findVehicleByParking(String token, Long parkingId){

        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        Parking parking = parkingRepository.findParkingById(parkingId);
        if (parking == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(parking.getVehicles(),HttpStatus.OK);
    }
    @Override
    public ResponseEntity<Parking> saveParking(String token, ParkingDto parkingDto) {
        try{

            if (!JwtUtil.isAuthorizedAdmin(token)) {
                return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
            }

            Parking byName = parkingRepository.findParkingByName(parkingDto.getName());
            Parking byCoordinates = parkingRepository.findParkingByCoord(parkingDto.getX(), parkingDto.getY());
            if(byName != null || byCoordinates != null){
                return new ResponseEntity<>(null, HttpStatus.CONFLICT);
            }
            Parking parking = new Parking(parkingDto);
            parkingRepository.save(parking);
            return new ResponseEntity<>(parking, HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<Parking>> saveParking(String token, List<ParkingDto> parkings){

        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        List<Parking> newParkings = new ArrayList<>();
        for(ParkingDto parking : parkings){
            newParkings.add(this.saveParking(token, parking).getBody());
        }
        return new ResponseEntity<>(newParkings, HttpStatus.OK);
    }

        @Override
    public ResponseEntity<Parking> updateParking(String token, ParkingDto parkingDto, Long id) {
            try {

                if (!JwtUtil.isAuthorizedAdmin(token)) {
                    return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
                }

                Parking parkingToModify = parkingRepository.findParkingById(id);

                if (parkingToModify == null) {
                    return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
                }

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
    public ResponseEntity<String> deleteParkingById(String token, Long id) {
        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        Parking parking = parkingRepository.findParkingById(id);
        if (parking == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        parkingRepository.deleteById(id);
        return new ResponseEntity<>("Ok", HttpStatus.OK);
    }

    @Override
    public boolean checkFreeSpace(Parking parking){
        return parking.getMaxCapacity() - parking.getCurrentCapacity() > 0;
    }

    @Override
    public ResponseEntity<String> addVehicleToParking(String token,Long parkingId, Long vehicleId){
        Parking finalParking = parkingRepository.findParkingById(parkingId);
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
            // initialParking.setCurrentCapacity(initialParking.getCurrentCapacity() - 1);
            // initialParking.removeVehicle(vehicle);
            // this.parkingRepository.save(initialParking);
            return new ResponseEntity<>("Impossible", HttpStatus.CONFLICT);
        }

        finalParking.setCurrentCapacity(finalParking.getCurrentCapacity() + 1);
        finalParking.addVehicle(vehicle);
        this.parkingRepository.save(finalParking);
        vehicle.setCurrentParking(finalParking);
        vehicleRepository.save(vehicle);
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }


    @Override
    public ResponseEntity<String> removeVehicleFromParking(String token, Long parkingId, Long vehicleId, VehicleService vehicleService){

        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>("Impossible", HttpStatus.UNAUTHORIZED);
        }

        Parking parking = parkingRepository.findParkingById(parkingId);
        if(parking != null) {
           boolean found = false;
           List<Vehicle> canBeRemoved = vehicleService.getVehiclesCanBeRemoved(token, parkingId).getBody();
           for(Vehicle v : canBeRemoved) {
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
               return new ResponseEntity<>("Impossible", HttpStatus.NOT_FOUND);
           } else {
               return new ResponseEntity<>( "OK", HttpStatus.OK);
           }
        }else {
            return new ResponseEntity<>("Impossible", HttpStatus.NOT_FOUND);
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
