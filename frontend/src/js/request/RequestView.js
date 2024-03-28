import React, { useState, useEffect } from 'react';
import '../../css/View.css';
import AppNavbar from "../AppNavbar";
import {Button, Container} from "react-bootstrap";
import {useHistory} from "react-router-dom";
const RequestView = ({ requestId }) => {
    const [requestData, setRequestData] = useState({
        date: '',
        departure: '',
        arrival:'',
        startHour:'',
        endHour:'',
        vehicleId:'',
        started: '',
        solved: ''
    });

    const history = useHistory();
    const handleViewVehicle = () => {
       window.location.href = `/vehicle/${requestData.vehicleId}`;
    };

    useEffect(() => {
        fetch(`/request/${requestId}`, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((data) => {
                // Selectively update the state based on fetched data
                setRequestData((prevData) => ({
                    ...prevData, // Keep the existing state
                    date: data.date,
                    departure: data.departure,
                    arrival: data.arrival,
                    startHour: data.startHour,
                    endHour: data.endHour,
                    vehicleId: data.vehicleId,
                    started: data.started,
                    solved: data.solved
                }));
                console.log(requestData.vehicleId);
            })
            .catch((error) => {
                console.error('Error fetching parking details:', error);
            });
    }, [requestId]);
    return (
        <div>
            <AppNavbar/>
            <Container className="mt-5 d-flex justify-content-center">
                <div className="view-form">
                    <h2 className="mb-4 text-center">View Request</h2>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Date:</label>
                        <button>{requestData.date}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Departure:</label>
                        <button>{requestData.departure}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Arrival:</label>
                        <button>{requestData.arrival}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Start Hour:</label>
                        <button>{requestData.startHour}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">End Hour:</label>
                        <button> {requestData.endHour} </button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Started:</label>
                        <button> {requestData.started ? "Yes" : "No"} </button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Finished:</label>
                        <button> {requestData.solved ? "Yes" : "No"} </button>
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

export default RequestView;