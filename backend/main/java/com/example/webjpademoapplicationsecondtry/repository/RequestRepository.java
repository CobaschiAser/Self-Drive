package com.example.webjpademoapplicationsecondtry.repository;

import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    @Query("SELECT r FROM Request r WHERE r.date = :date")
    List<Request> findRequestByDate(@Param("date") Date date);

    @Query("SELECT r FROM Request r WHERE r.owner.id = :id")
    List<Request> findRequestByUser(@Param("id") Long id);

    @Query("SELECT r FROM Request r WHERE r.vehicleId = :vehicleId ORDER BY r.date,r.startHour")
    List<Request> findByDateVehicle(@Param("vehicleId") Long vehicleId);

    @Query("SELECT r FROM Request r WHERE r.id = :id")
    Request findRequestById(@Param("id") Long id);
}
