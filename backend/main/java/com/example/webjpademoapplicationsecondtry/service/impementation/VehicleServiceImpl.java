package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import com.example.webjpademoapplicationsecondtry.exception.NotFoundException;
import com.example.webjpademoapplicationsecondtry.repository.RequestRepository;
import com.example.webjpademoapplicationsecondtry.repository.VehicleRepository;
import com.example.webjpademoapplicationsecondtry.service.ParkingService;
import com.example.webjpademoapplicationsecondtry.service.VehicleService;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    private final RequestRepository requestRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, RequestRepository requestRepository) {
        this.vehicleRepository = vehicleRepository;
        this.requestRepository = requestRepository;
    }


    @Override
    public List<Vehicle> findAllVehicle() {
        return vehicleRepository.findAll();
    }

    @Override
    public Vehicle findVehicleById(Long id) {
        return vehicleRepository.findById(id).orElseThrow(
                () -> new NotFoundException("There is no vehicle with id = " + id)
        );
    }

    @Override
    public Vehicle saveVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Override
    public List<Vehicle> saveAllVehicle(List<Vehicle> vehicleList){
        return vehicleRepository.saveAll(vehicleList);
    }
    @Override
    public Vehicle updateVehicle(Vehicle vehicle, Long id) {
        Vehicle toModifyVehicle = vehicleRepository.findById(id).orElseThrow(
                () -> new NotFoundException("There is no user with id: " + id)
        ); // we assure that there is a user with id given in order to modify that user
        toModifyVehicle.setPriceComfort(vehicle.getPriceComfort());
        toModifyVehicle.setPriceTime(vehicle.getPriceTime());
        toModifyVehicle.setPriceDistance(vehicle.getPriceDistance());
        return vehicleRepository.save(toModifyVehicle);
    }

    @Override
    public void deleteVehicleById(Long vehicleId, ParkingService parkingService) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(
                () -> new NotFoundException("Cannot make delete operation.There is no vehicle with id: "+ vehicleId)
        ); // before continue, we assure that there is a vehicle with given ID
        //if(!vehicle.isBusy()) {
            //Parking parking = vehicle.getCurrentParking();
            //if (parking != null) {
                //parkingService.removeVehicleFromParking(parking.getId(), vehicleId);
           // }
            //vehicleRepository.deleteById(vehicleId);
        //}else {
            //throw new AlreadyBusyException("You cannot delete a vehicle that is busy");
        //}
    }

    @Override
    public  List<Vehicle> willBeInDeparture(String departure, Date date, Integer startHour, String vehicleType){
        List<Vehicle> allVehicle = vehicleRepository.findVehicleByType(vehicleType);
        List<Vehicle> result = new ArrayList<>();

        for(Vehicle vehicle: allVehicle) {
            // requests that vehicle is involved in that day ordered by startHour
            List<Request> requests = requestRepository.findByDateVehicle( vehicle.getId());

            String lastParkingName = null;
            // last request committed that day until that moment

            Request lastRequest = null;
            if(requests != null && !requests.isEmpty()) {
                lastRequest = requests.get(requests.size() - 1);
            }
            // For the moment, allow to create a new Request only if it's the last on the day until that moment

            // if no requests with that vehicle, simply add it to results
            if(lastRequest == null){
                if(vehicle.getCurrentParking() != null) {
                    lastParkingName = vehicle.getCurrentParking().getName();
                }
                if(Objects.equals(lastParkingName, departure)) {
                    result.add(vehicle);
                }
                continue;
            }

            if(lastRequest.getDate().compareTo(date) > 0){
                continue;
            }

            // if lastRequest was finished, change the lastParkingName
            if(lastRequest.getSolved()) {
                lastParkingName = lastRequest.getArrival();
                if(lastRequest.getDate().compareTo(date) < 0 && Objects.equals(lastParkingName, departure)) {
                    result.add(vehicle);
                } else if(lastRequest.getDate().compareTo(date) == 0){
                    if(lastRequest.getEndHour() < startHour && Objects.equals(lastParkingName, departure)){
                        result.add(vehicle);
                    }
                }
            }
        }
        return result;
    }

    @Override
    public List<Vehicle> willBeInDepartureUpdate(String departure, Date date, Integer startHour,Long initialVehicleId, String vehicleType){
        List<Vehicle> willBe = this.willBeInDeparture(departure, date, startHour, vehicleType);
        Vehicle initialVehicle = vehicleRepository.findVehicleById(initialVehicleId);
        if (initialVehicle.getType().compareTo(vehicleType) == 0 && departure.compareTo(initialVehicle.getCurrentParking().getName()) == 0) {
            willBe.add(initialVehicle);
        }
        return willBe;
    }



}
