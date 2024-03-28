import React, { useState, useEffect } from 'react';
import '../../css/View.css';
import {Link} from "react-router-dom";
import AppNavbar from "../AppNavbar";
import {Button, Container, Form} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from "@react-google-maps/api";
import AdminSidebar from "../AdminSidebar";
const ParkingView = ({ parkingId }) => {
    const [parkings, setParkings] = useState([]);
    const [parkingData, setParkingData] = useState({
        name: '',
        x: '',
        y: '',
        maxCapacity: '',
        currentCapacity: '',
        vehicles: ''
    });
    const [selectedParking, setSelectedParking] = useState(null);
    const center = { lat: 47.164775, lng: 27.580579 };
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "",
    });

    const customMarkerIcon = {
        path: "M256,0C156.32,0,76.8,79.52,76.8,179.2C76.8,256,256,512,256,512s179.2-256,179.2-332.8C435.2,79.52,355.68,0,256,0z M256,243.2c-46.08,0-83.2-37.12-83.2-83.2s37.12-83.2,83.2-83.2s83.2,37.12,83.2,83.2S302.08,243.2,256,243.2z",
        fillColor: "blue",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 0.1
    };

    useEffect(() => {
        // Fetch parking data from API
        fetch(`http://localhost:2810/parking`)
            .then(response => response.json())
            .then(data => {
                setParkings(data);
            })
            .catch(error => console.error('Error fetching parking data:', error));
    }, []);

    const history = useHistory();
    const handleViewVehicles = (e) => {
        window.location.href = `/parking/${parkingId}/vehicles`;
    };

    useEffect(() => {
        fetch(`/parking/byId/${parkingId}`)
            .then((response) => response.json())
            .then((data) => {
                // Selectively update the state based on fetched data
                setParkingData((prevData) => ({
                    ...prevData, // Keep the existing state
                    name: data.name,
                    x: data.x,
                    y: data.y,
                    maxCapacity: data.maxCapacity,
                    currentCapacity: data.currentCapacity,
                    vehicles:data.vehicles
                }));
            })
            .catch((error) => {
                console.error('Error fetching parking details:', error);
            });
    }, [parkingId]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <AppNavbar/>
            <div style={{ display: 'flex', height: '90vh' }}>
                <div style={{ flex: 2, border: '1px solid black', padding: '10px'}}>
                    <Container className="mt-5 d-flex justify-content-center border-1">
                        <div className="view-form">
                            <h2 className="mb-4 text-center">View Parking: {parkingData.name}</h2>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Name:</label>
                                <button>{parkingData.name}</button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Coordinate X:</label>
                                <button>{parkingData.x}</button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Coordinate Y:</label>
                                <button>{parkingData.y}</button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Maximum Capacity:</label>
                                <button>{parkingData.maxCapacity}</button>
                            </div>
                            <br/>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="font-weight-bold">Current Capacity:</label>
                                <button> {parkingData.currentCapacity} </button>
                            </div>
                            <br/>
                            {parkingData.vehicles.length > 0 &&
                                <div className="d-flex justify-content-center">
                                    <Button variant="primary" type="button" className="text-center" onClick={handleViewVehicles}>
                                        View Vehicles
                                    </Button>
                                </div>
                            }
                        </div>
                    </Container>
                </div>
                <div style={{ flex: 3, position: 'relative', border: '1px solid black'}}>
                    <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px', border: '1px solid black', overflow: 'hidden'}}>

                    <GoogleMap center={center} zoom={12} mapContainerStyle={{ width: '100%', height: '100%', border: '3px solid black', overflow: 'hidden'}}>
                {parkings.map(parking => (
                    <Marker key={parking.id} position={{ lat: parking.x, lng: parking.y }} onClick={() => setSelectedParking(parking)}/>
                ))}
                {selectedParking && (
                    <InfoWindow
                        position={{ lat: selectedParking.x, lng: selectedParking.y }}
                        onCloseClick={() => setSelectedParking(null)}
                    >
                        <div>
                            <p>{selectedParking.name}</p>
                            <p>Current capacity: {selectedParking.currentCapacity}</p>
                            <p>Max capacity: {selectedParking.maxCapacity}</p>
                        </div>
                    </InfoWindow>
                )}

            </GoogleMap>
                    </div>
                </div>
        </div>
        </div>
    );
};

export default ParkingView;