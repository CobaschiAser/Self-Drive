import React, { useState } from 'react';
import '../../css/CreateForm.css';
import AppNavbar from "../AppNavbar";
import {Button, Container, Form} from "react-bootstrap";

const NewVehicleForm = () => {
    const [vehicleData, setVehicleData] = useState({
        brand: '',
        model: '',
        type: '',
        seat: '',
        comfort: '',
        fabricationYear: '',
        maxAutonomy: '',
        priceComfort: '',
        priceTime: '',
        priceDistance: ''
    });

    const [emptyField, setEmptyField] = useState(false);
    const [successfullyCreated, setSuccessfullyCreated] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleData({ ...vehicleData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(
            vehicleData.brand === '' ||
            vehicleData.model === '' ||
            vehicleData.type === '' ||
            vehicleData.seat === '' ||
            vehicleData.comfort === '' ||
            vehicleData.fabricationYear === '' ||
            vehicleData.maxAutonomy === '' ||
            vehicleData.priceComfort === '' ||
            vehicleData.priceTime === '' ||
            vehicleData.priceDistance === ''
        ){
            setEmptyField(true);
            setSuccessfullyCreated(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:2810/vehicle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vehicleData),
            });
            if (response.ok) {
                setEmptyField(false);
                setSuccessfullyCreated(true);
                // Success - handle the successful creation
                console.log('Vehicle created successfully');
                // Reset form data
                setVehicleData({
                    brand: '',
                    model: '',
                    type: '',
                    seat: '',
                    comfort: '',
                    fabricationYear: '',
                    maxAutonomy: '',
                    priceComfort: '',
                    priceTime: '',
                    priceDistance: ''
                });
            } else {
                // Handle error
                console.error('Failed to create vehicle');
            }
        } catch (error) {
            console.error('Error creating vehicle:', error);
        }
    };

    return (
        <div>
            <AppNavbar/>
            <Container className="mt-5 d-flex justify-content-center">
                <Form className="create-form">
                    {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text></div>}
                    <br/>
                    <h2 className="mb-b text-center">Create Vehicle Form</h2>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                            type="text"
                            name="brand"
                            placeholder="Enter brand"
                            value={vehicleData.brand}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Model</Form.Label>
                        <Form.Control
                            type="text"
                            name="model"
                            placeholder="Enter model"
                            value={vehicleData.model}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="type"
                            value={vehicleData.type}
                            onChange={handleChange}
                        >
                            <option value="">Select type</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Berlina"> Berlin </option>
                            <option value="Break"> Break </option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Seat Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="seat"
                            placeholder="Enter seat number"
                            value={vehicleData.seat}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Comfort</Form.Label>
                        <Form.Control
                            type="text"
                            name="comfort"
                            placeholder="Enter comfort"
                            value={vehicleData.comfort}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Fabrication Year</Form.Label>
                        <Form.Control
                            type="text"
                            name="fabricationYear"
                            placeholder="Enter fabricationYear"
                            value={vehicleData.fabricationYear}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Maximum Autonomy</Form.Label>
                        <Form.Control
                            type="text"
                            name="maxAutonomy"
                            placeholder="Enter maximum autonomy"
                            value={vehicleData.maxAutonomy}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Comfort Price </Form.Label>
                        <Form.Control
                            type="text"
                            name="priceComfort"
                            placeholder="Enter comfort price"
                            value={vehicleData.priceComfort}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Time Price </Form.Label>
                        <Form.Control
                            type="text"
                            name="priceTime"
                            placeholder="Enter time price"
                            value={vehicleData.priceTime}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Distance Price </Form.Label>
                        <Form.Control
                            type="text"
                            name="priceDistance"
                            placeholder="Enter distance price"
                            value={vehicleData.priceDistance}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <br/>
                    <div className="text-center">
                        <Button variant="primary" type="button" onClick={handleSubmit}>
                            Create Vehicle
                        </Button>
                        <br/>
                        {successfullyCreated && <Form.Text className="success"> Vehicle successfully created</Form.Text> }
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default NewVehicleForm;