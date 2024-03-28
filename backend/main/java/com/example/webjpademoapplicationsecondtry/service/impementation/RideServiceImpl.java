package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.entity.*;
import com.example.webjpademoapplicationsecondtry.exception.NotFoundException;
import com.example.webjpademoapplicationsecondtry.repository.*;
import com.example.webjpademoapplicationsecondtry.service.RideService;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@Service
public class RideServiceImpl implements RideService {

    private final RequestRepository requestRepository;
    private final ParkingRepository parkingRepository;
    private final VehicleRepository vehicleRepository;

    private final ParkingFluxRepository parkingFluxRepository;

    private final RideRepository rideRepository;

    private final AppUserRepository appUserRepository;


    public RideServiceImpl(RideRepository rideRepository, AppUserRepository appUserRepository, RequestRepository requestRepository, ParkingRepository parkingRepository, VehicleRepository vehicleRepository, ParkingFluxRepository parkingFluxRepository) {
        this.rideRepository = rideRepository;
        this.requestRepository = requestRepository;
        this.parkingRepository = parkingRepository;
        this.vehicleRepository = vehicleRepository;
        this.parkingFluxRepository = parkingFluxRepository;
        this.appUserRepository = appUserRepository;
    }

    @Override
    public Ride findRideById(Long id) {
        return rideRepository.findById(id).orElseThrow(
                () -> new NotFoundException("There is no ride with id: " + id)
        );
    }

    @Override
    public List<Ride> findAllRide() {
        return rideRepository.findAll();
    }

    @Override
    public List<Ride> findRideByDate(Date date) {
        if(rideRepository.findRideByDate(date).isEmpty()){
            throw new NotFoundException("There is no ride with date: " + date);
        }
        return rideRepository.findRideByDate(date);
    }

    @Override
    public Ride saveRide(Long id) {
       Request r = requestRepository.findById(id).orElseThrow(
               () -> new NotFoundException("There is no request with id given. Impossible to create the ride")
       );

       Date date = r.getDate();
       Integer startHour = r.getStartHour();
       Integer endHour = r.getEndHour();
       String departure = r.getDeparture();
       String arrival = r.getArrival();
       Long vehicleId = r.getVehicleId();
       AppUser owner = r.getOwner();

       Parking departureParking = parkingRepository.findParkingByName(departure);
       Parking arrivalParking = parkingRepository.findParkingByName(arrival);
       Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(
               () -> new NotFoundException("There is no vehicle with id: "+ vehicleId)
       );

            // make vehicle not busy // TO DO: make this when ride stops
            // and mark that now he is in arrivalParking
            // increase also current_autonomy
        //vehicle.setCurrentAutonomy(vehicle.getCurrentAutonomy() + dist);
            //vehicle.setBusy(false);
        //vehicle.setCurrentParking(arrivalParking);
        //vehicleRepository.save(vehicle);

            // decrement departureParking currentCapacity
            // and mark that vehicle left this parking

        //departureParking.setCurrentCapacity(departureParking.getCurrentCapacity() - 1);
        //departureParking.removeVehicle(vehicle);

            // decrement arrivalParking reservedCapacity and increase currentCapacity
            // and mark that vehicle is now here
            //arrivalParking.setReservedCapacity(arrivalParking.getReservedCapacity() - 1);
        //arrivalParking.setCurrentCapacity(arrivalParking.getCurrentCapacity() + 1);
        //arrivalParking.addVehicle(vehicle);
        //parkingRepository.save(arrivalParking);

            // update parkingFluxes of implied Parkings(departure and arrival)
        ParkingFlux parkingFluxFromDeparture = parkingFluxRepository.findParkingFluxByDateAndParking(date, departureParking);
        parkingFluxFromDeparture.setOutput(parkingFluxFromDeparture.getOutput() + 1);
        parkingFluxRepository.save(parkingFluxFromDeparture);

        ParkingFlux parkingFluxFromArrival = parkingFluxRepository.findParkingFluxByDateAndParking(date, arrivalParking);
        parkingFluxFromArrival.setInput(parkingFluxFromArrival.getInput() + 1);
        parkingFluxRepository.save(parkingFluxFromArrival);

        //r.setSolved(true);
        //requestRepository.save(r);

        double dist = Math.sqrt((departureParking.getX() - arrivalParking.getX()) *(departureParking.getX() - arrivalParking.getX()) + (departureParking.getY() - arrivalParking.getY()) *(departureParking.getY() - arrivalParking.getY()));

        double price_0 = vehicle.getPriceComfort();
        double price_1 = vehicle.getPriceTime();
        double price_2 = vehicle.getPriceDistance();

        Ride resultedRide = new Ride(
                    dist,
                    price_0 + price_1 + price_2,
                    date,
                    startHour,
                    endHour,
                    departure,
                    arrival,
                    vehicle.getId(),
                    owner
        );
        rideRepository.save(resultedRide);
        return  resultedRide;
    }


    public AppUser checkAndGetUser(UUID uuid){
        return appUserRepository.findById(uuid).orElseThrow(
                () -> new NotFoundException("Cannot create this request. There is no user with specified id: " +uuid)
        );
    }

}
