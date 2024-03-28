import React, { useState, useEffect } from 'react';
import '../../css/View.css';
import AppNavbar from "../AppNavbar";
import {Button, Container} from "react-bootstrap";
const VehicleView = ({ vehicleId }) => {
    const [vehicleData, setVehicleData] = useState({
        numberPlate: '',
        brand: '',
        model: '',
        type: '',
        fabricationYear: '',
        comfort: '',
        seat: '',
        maxAutonomy: '',
        currentAutonomy: '',
        priceComfort: '',
        priceTime: '',
        priceDistance: ''
    });
    const [showPrices, setShowPrices] = useState(false);
    const [titleButton, setTitleButton] = useState(["Show Prices", "Cover Prices"]);
    const [index, setIndex] = useState(0);
    useEffect(() => {
        fetch(`/vehicle/${vehicleId}`)
            .then((response) => response.json())
            .then((data) => {
                // Selectively update the state based on fetched data
                setVehicleData((prevData) => ({
                    ...prevData, // Keep the existing state
                    numberPlate: data.numberPlate,
                    brand: data.brand,
                    model: data.model,
                    type: data.type,
                    fabricationYear: data.fabricationYear,
                    comfort: data.comfort,
                    seat: data.seat,
                    maxAutonomy: data.maxAutonomy,
                    currentAutonomy: data.currentAutonomy,
                    priceComfort: data.priceComfort,
                    priceTime: data.priceTime,
                    priceDistance: data.priceDistance
                }));
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });

    }, [vehicleId]);

    const togglePrices = () => {
        setShowPrices((prevState) => !prevState);
        setIndex((prevState) => (1-prevState));
    };

    return (

        <div>
            <AppNavbar/>
            <Container className="mt-5 d-flex justify-content-center">
                <div className="view-form">
                    <h2 className="mb-4 text-center">View Vehicle {vehicleData.numberPlate}</h2>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Brand:</label>
                        <button>{vehicleData.brand}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Model:</label>
                        <button>{vehicleData.model}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Type:</label>
                        <button>{vehicleData.type}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Fabrication Year:</label>
                        <button>{vehicleData.fabricationYear}</button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Maximum Autonomy:</label>
                        <button> {vehicleData.maxAutonomy} </button>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="font-weight-bold">Current Autonomy:</label>
                        <button> {vehicleData.currentAutonomy} </button>
                    </div>
                    <br/>
                    <div className="d-flex justify-content-center">
                            <Button variant="primary" type="button" className="text-center" onClick={togglePrices}>
                                {titleButton[index]}
                            </Button>
                    </div>
                    {showPrices && (
                        <div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Comfort Price:</label>
                                <button> {vehicleData.priceComfort} </button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Time Price:</label>
                                <button> {vehicleData.priceTime} </button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Distance Price:</label>
                                <button> {vehicleData.priceTime} </button>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </div>

    );
};

export default VehicleView;