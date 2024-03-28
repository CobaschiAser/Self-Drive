package com.example.webjpademoapplicationsecondtry.repository;

import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;


@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query("SELECT v FROM Vehicle v WHERE v.type = :type")
    public List<Vehicle> findVehicleByType(@Param("type") String type);

    @Query("SELECT v FROM Vehicle v WHERE v.id = :id")
    public Vehicle findVehicleById(@Param("id") Long id);

}
