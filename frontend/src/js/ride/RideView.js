import React, { useState, useEffect } from 'react';
import '../../css/View.css';
import {Link, useHistory} from "react-router-dom";
import AppNavbar from "../AppNavbar";
import {Button, Container} from "react-bootstrap";
const RideView = ({ rideId }) => {
    const [rideData, setRideData] = useState({
        distance: '',
        price: '',
        date: '',
        startHour: '',
        endHour: '',
        departure: '',
        arrival: '',
        vehicleId: ''
    });

    const history = useHistory();
    const handleViewVehicle = () => {
        window.location.href = `/vehicle/${rideData.vehicleId}`;
    };

    useEffect(() => {
        fetch(`/ride/${rideId}`)
            .then((response) => response.json())
            .then((data) => {
                // Selectively update the state based on fetched data
                setRideData((prevData) => ({
                    ...prevData, // Keep the existing state
                    distance: data.distance,
                    price: data.price,
                    date: data.date,
                    startHour: data.startHour,
                    endHour: data.endHour,
                    departure: data.departure,
                    arrival: data.arrival,
                    vehicleId: data.vehicleId
                }));
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });

    }, [rideId]);


    return (
        <div>
            <AppNavbar/>
            <Container className="mt-5 d-flex justify-content-center">
                <div className="view-form">
                    <h2 className="mb-4 text-center">View Ride</h2>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Date:</label>
                        <button>{rideData.date}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Departure:</label>
                        <button>{rideData.departure}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Arrival:</label>
                        <button>{rideData.arrival}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Start Hour:</label>
                        <button>{rideData.startHour}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">End Hour:</label>
                        <button> {rideData.endHour} </button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Distance:</label>
                        <button> {rideData.distance} </button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Price:</label>
                        <button> {rideData.price} </button>
                    </div>
                    <br/>
                    <div className="d-flex justify-content-center">
                        <button className="text-center" onClick={handleViewVehicle}>
                            View Vehicle
                        </button>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default RideView;