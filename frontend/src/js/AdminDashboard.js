import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminSidebar from "./AdminSidebar";
import AppNavbar from "./AppNavbar";

import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import AppFooter from "./AppFooter";

const AdminDashboard = () => {
    const [parkings, setParkings] = useState([]);
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const center = { lat: 47.164775, lng: 27.580579 };
    const [selectedParking, setSelectedParking] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "",
    });

    useEffect(() => {
        // Fetch parking data from API
        fetch(`http://localhost:2810/parking`)
            .then(response => response.json())
            .then(data => {
                setParkings(data);
            })
            .catch(error => console.error('Error fetching parking data:', error));
    }, []);

    useEffect(() => {
        // Fetch parking data from API
        fetch(`http://localhost:2810/user`)
            .then(response => response.json())
            .then(data => {
                setUsers(data);
            })
            .catch(error => console.error('Error fetching user data:', error));
    }, []);

    useEffect(() => {
        // Fetch parking data from API
        fetch(`http://localhost:2810/vehicle`)
            .then(response => response.json())
            .then(data => {
                setVehicles(data);
            })
            .catch(error => console.error('Error fetching vehicle data:', error));
    }, []);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <AppNavbar />
            <div style={{ display: 'flex', height: '90vh' }}>
                <div style={{ flex: 1, border: '1px solid black', padding: '10px', backgroundColor: 'gray'}}>
                    <AdminSidebar/>
                </div>
                <div style={{ flex: 4, position: 'relative', border: '1px solid black', backgroundColor: 'darkgray'}}>
                    <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px', border: '1px solid black', borderRadius: '5px', overflow: 'hidden', backgroundColor: 'gray' }}>
                        <GoogleMap center={center} zoom={12} mapContainerStyle={{ width: '100%', height: '75%', border: '2px solid black', borderRadius: '10px', overflow: 'hidden'}}>
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
                        <div style={{ width : '100%', height: '25%', display: 'flex', flexDirection: 'column', border: '1px solid black', backgroundColor: 'lightgray' }}>
                            <h4 style={{ textAlign: 'center', height: '40%' }}>General Overview</h4>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <p>Parking number: {parkings.length}</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <p>User number: {users.length}</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <p>Vehicle number: {vehicles.length}</p>
                                </div>
                            </div>
                        </div>


                    </div>

                </div>
            </div>
            <AppFooter/>
        </div>
    );
};

export default AdminDashboard;
