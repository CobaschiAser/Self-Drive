import React, { useState, useEffect } from 'react';
import '../../css/EditForm.css';
import AppNavbar from "../AppNavbar";
import {Button, Container, Form} from "react-bootstrap";

const EditVehicleForm = ({ vehicleId }) => {
    const [vehicleData, setVehicleData] = useState({
        brand: '',
        model: '',
        seat: '',
        comfort: '',
        fabricationYear: '',
        type: '',
        maxAutonomy: '',
        currentAutonomy: '',
        priceComfort: '',
        priceTime: '',
        priceDistance: ''
    });

    const [emptyField, setEmptyField] = useState(false);
    const [successfullyEdited, setSuccessfullyEdited] = useState(false);
    const [conflict, setConflict] = useState(false);

    useEffect(() => {
        fetch(`/vehicle/${vehicleId}`)
            .then((response) => response.json())
            .then((data) => {
                // Selectively update the state based on fetched data
                setVehicleData((prevData) => ({
                    ...prevData, // Keep the existing state
                    brand: data.brand,
                    model: data.model,
                    seat: data.seat,
                    comfort: data.comfort,
                    fabricationYear: data.fabricationYear,
                    type: data.type,
                    maxAutonomy: data.maxAutonomy,
                    currentAutonomy: data.currentAutonomy,
                    priceComfort: data.priceComfort,
                    priceTime: data.priceTime,
                    priceDistance: data.priceDistance
                }));
            })
            .catch((error) => {
                console.error('Error fetching parking details:', error);
            });
    }, [vehicleId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleData({ ...vehicleData, [name]: value });
    };

    const handleSubmit = (e) => {

        if (
            vehicleData.priceDistance === '' ||
            vehicleData.priceComfort === '' ||
            vehicleData.priceTime === ''
        ) {
            setEmptyField(true);
            setSuccessfullyEdited(false);
            setConflict(false);
            return;
        }


        e.preventDefault();
        // Send updated parkingData to backend for modification
        fetch(`/vehicle/${vehicleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vehicleData),
        })
            .then((response) => {
                // Handle response if needed
                setSuccessfullyEdited(true);
                setEmptyField(false);
                setConflict(false);
            })
            .catch((error) => {
                setSuccessfullyEdited(false);
                setEmptyField(false);
                setConflict(true);
                console.error('Error updating parking:', error);
            });
    };

    return (
        <div>
            <AppNavbar/>
            <Container className="mt-5 d-flex justify-content-center">
                <Form className="register-form">
                    {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text></div>}
                    <br/>
                    <h2 className="mb-b text-center">Edit Vehicle Form</h2>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Time Price</Form.Label>
                        <Form.Control
                            type="text"
                            name="priceTime"
                            value={vehicleData.priceTime}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Comfort Price</Form.Label>
                        <Form.Control
                            type="text"
                            name="priceComfort"
                            value={vehicleData.priceComfort}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Distance Price</Form.Label>
                        <Form.Control
                            type="text"
                            name="priceDistance"
                            value={vehicleData.priceDistance}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <br/>
                    <div className="text-center">
                        <Button variant="primary" type="button" onClick={handleSubmit}>
                            Edit Vehicle
                        </Button>
                        <br/>
                        {successfullyEdited && <Form.Text className="success"> Vehicle successfully edited</Form.Text> }
                        {conflict && <Form.Text className="text-danger"> Error. Please try again</Form.Text> }
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default EditVehicleForm;