package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.entity.Move;
import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import com.example.webjpademoapplicationsecondtry.repository.MoveRepository;
import com.example.webjpademoapplicationsecondtry.repository.ParkingRepository;
import com.example.webjpademoapplicationsecondtry.repository.VehicleRepository;
import com.example.webjpademoapplicationsecondtry.service.ParkingService;
import com.example.webjpademoapplicationsecondtry.service.RebalancingService;
import com.example.webjpademoapplicationsecondtry.service.VehicleService;
import com.example.webjpademoapplicationsecondtry.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RebalancingServiceImpl implements RebalancingService {

    private final ParkingRepository parkingRepository;

    private final MoveRepository moveRepository;

    private final VehicleRepository vehicleRepository;

    public RebalancingServiceImpl(ParkingRepository parkingRepository, MoveRepository moveRepository, VehicleRepository vehicleRepository) {
        this.parkingRepository = parkingRepository;
        this.moveRepository = moveRepository;
        this.vehicleRepository = vehicleRepository;
    }


    private void cleanMoveRepository() {
        moveRepository.deleteAllInBatch();
    }

    @Override
    public ResponseEntity<List<Move>> rebalance(String token, String period, ParkingService parkingService, VehicleService vehicleService) {
        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        cleanMoveRepository();
        List<Move> moves = new ArrayList<>();
        Map<Long, Long> hierarchy = parkingService.findParkingHierarchy(token, period).getBody();
        List<Long> keys = new ArrayList<>();
        if (hierarchy != null) {
            keys = hierarchy.keySet().stream().toList();
        }

        for (int i = keys.size() - 1 ; i >= 0; i--) {
            Long parkingId = keys.get(i);
            Parking parking = parkingRepository.findParkingById(parkingId);
            List<Vehicle> vehicles = vehicleService.getVehiclesAfterRequest(token, parkingId).getBody();
            long toAdd ;
            if (vehicles == null) {
                toAdd = hierarchy.get(parkingId);
            } else {
                toAdd= (hierarchy.get(parkingId) < (long)(parking.getMaxCapacity() - vehicles.size())) ? hierarchy.get(parkingId) : (long)(parking.getMaxCapacity() - vehicles.size());
            }
            long added = 0L;
            int j = 0;
            while (added < toAdd && j < i) {
                //
                // TODO Here to take into consideration the vehicles unassigned
                //
                List<Vehicle> unassignedVehicles = vehicleService.getVehiclesCanBeAdded(token).getBody();
                if (unassignedVehicles != null) {
                    for (Vehicle vehicle : unassignedVehicles) {
                        if (added < toAdd) {
                            Move move = new Move("DEPOU", parking.getName(), vehicle.getId());
                            moveRepository.save(move);
                            moves.add(move);
                            added++ ;
                            vehicle.setCurrentParking(parking);
                            parking.addVehicle(vehicle);
                            parking.setCurrentCapacity(parking.getCurrentCapacity() + 1);
                            vehicleRepository.save(vehicle);
                            parkingRepository.save(parking);
                        } else {
                            break;
                        }
                    }
                }
                if (added < toAdd) {
                    Long parkingJId = keys.get(j);
                    if (hierarchy.get(parkingJId) == 0) {
                        List<Vehicle> canBeMovedFromJ = vehicleService.getVehiclesCanBeRemoved(token, keys.get(j)).getBody();
                        if (canBeMovedFromJ == null) {
                            j++;
                            continue;
                        }
                        if (canBeMovedFromJ.size() == 0) {
                            j++;
                            continue;
                        }
                        else if (canBeMovedFromJ.size() == 1){
                            if (parking.getCurrentCapacity() <= canBeMovedFromJ.size()) {
                                Vehicle vehicle = canBeMovedFromJ.get(0);
                                Parking parkingJ = parkingRepository.findParkingById(parkingJId);
                                Move move = new Move(parkingJ.getName(), parking.getName(), vehicle.getId());
                                moveRepository.save(move);
                                moves.add(move);
                                added++ ;
                                vehicle.setCurrentParking(parking);
                                parking.addVehicle(vehicle);
                                parking.setCurrentCapacity(parking.getCurrentCapacity() + 1);
                                parkingJ.removeVehicle(vehicle);
                                parkingJ.setCurrentCapacity(parkingJ.getCurrentCapacity() - 1);
                                vehicleRepository.save(vehicle);
                                parkingRepository.save(parking);
                                parkingRepository.save(parkingJ);
                            }  else {
                                j++;
                                continue;
                            }
                        } else {
                            for (Vehicle vehicle : canBeMovedFromJ) {
                                if (added < toAdd) {
                                    Parking parkingJ = parkingRepository.findParkingById(parkingJId);
                                    Move move = new Move(parkingJ.getName(), parking.getName(), vehicle.getId());
                                    moveRepository.save(move);
                                    moves.add(move);
                                    added++ ;
                                    vehicle.setCurrentParking(parking);
                                    parking.addVehicle(vehicle);
                                    parking.setCurrentCapacity(parking.getCurrentCapacity() + 1);
                                    parkingJ.removeVehicle(vehicle);
                                    parkingJ.setCurrentCapacity(parkingJ.getCurrentCapacity() - 1);
                                    vehicleRepository.save(vehicle);
                                    parkingRepository.save(parking);
                                    parkingRepository.save(parkingJ);
                                } else {
                                    break;
                                }
                            }
                        }
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        return new ResponseEntity<>(moves, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Map<String, Long>> findMovesByParking(String token, Long parkingId){

        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        if (parkingId != 0) {
            Parking theParking = parkingRepository.findParkingById(parkingId);
            List<Parking> parkings = parkingRepository.findAll();
            Map<String, Long> countMap = new HashMap<>();
            for (Parking parking : parkings) {
                if (parking.getId() != parkingId) {
                    List<Move> moves = moveRepository.findMovesByParkings(theParking.getName(), parking.getName());
                    countMap.put(parking.getName(), (long) moves.size());
                }
            }
            return new ResponseEntity<>(countMap, HttpStatus.OK);
        } else {
            List<Parking> parkings = parkingRepository.findAll();
            Map<String, Long> countMap = new HashMap<>();
            for (Parking parking : parkings) {
                if (parking.getId() != parkingId) {
                    List<Move> moves = moveRepository.findMovesByParkings("DEPOU", parking.getName());
                    countMap.put(parking.getName(), (long) moves.size());
                }
            }
            return new ResponseEntity<>(countMap, HttpStatus.OK);
        }
    }

}
