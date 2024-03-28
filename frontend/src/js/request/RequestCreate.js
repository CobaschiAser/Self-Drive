import React, {useEffect, useState} from 'react';
import '../../css/CreateForm.css';
import AppNavbar from "../AppNavbar";
import {Button, Container, Form} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const NewRequestForm = ({userId}) => {

    const [requestData, setRequestData] = useState({
        date: '',
        departure: '',
        arrival: '',
        startHour: '',
        endHour: '',
        vehicleType: '',
        vehicleId: ''
    });

    const [emptyField, setEmptyField] = useState(false);
    const [successfullyCreated, setSuccessfullyCreated] = useState(false);
    const [validStartHour, setValidStartHour] = useState(true);
    const [validEndHour, setValidEndHour] = useState(true);
    const [parkings, setParkings] = useState([]);
    const [validDeparture, setValidDeparture] = useState(true);
    const [validArrival, setValidArrival] = useState(true);
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        async function fetchParkings() {
            try {
                const response = await fetch('/parking');
                if (response.ok) {
                    const data = await response.json();
                    setParkings(data);
                } else {
                    console.error('Failed to fetch parkings');
                }
            } catch (error) {
                console.error('Error fetching parkings:', error);
            }
        }

        fetchParkings();
    }, []);

    const handleSelectVehicle = async (e) => {
        if (requestData.date === '' ||
            requestData.departure === '' ||
            requestData.startHour === '' ||
            requestData.vehicleType === ''
        ) {
            return;
        }
        try {
            console.log(requestData.date);
            const url = `/vehicle/available-in-departure?date=${requestData.date}&departure=${requestData.departure}&startHour=${requestData.startHour}&vehicleType=${requestData.vehicleType}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setVehicles(data);
            } else {
                console.error('Failed to fetch vehicles');
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    }

    const handleDateChange = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        console.log(formattedDate);
        setRequestData({ ...requestData, date: formattedDate });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequestData({ ...requestData, [name]: value });
        // validate Departure
        if (name === "departure") {
            console.log(value);
            if (value === requestData.arrival) {
                setValidDeparture(false);
                return;
            } else {
                setValidDeparture(true);
            }
        }
        // validate Arrival
        if (name === "arrival") {
            if (value === requestData.departure) {
                setValidArrival(false);
                return;
            } else {
                setValidArrival(true);
            }
        }
        // Validate star hour
        if (name === "startHour") {
            if (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 23 || parseInt(value) >= parseInt(requestData.endHour)) {
                console.error("Invalid start hour. Please enter a number between 0 and 23.");
                setValidStartHour(false);
                return;
            } else{
                setValidStartHour(true);
            }
        }
        // validate end hour
        if (name === "endHour") {
            if (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 23 || parseInt(value) <= parseInt(requestData.startHour)) {
                setValidEndHour(false);
            } else{
                setValidEndHour(true);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validStartHour || !validEndHour) {
            return;
        }

        if (requestData.date === '' ||
            requestData.departure === '' ||
            requestData.arrival === '' ||
            requestData.startHour === '' ||
            requestData.endHour === '' ||
            requestData.vehicleType === '' ||
            requestData.vehicleId === ''
        ){
            setEmptyField(true);
            setSuccessfullyCreated(false);
            return;
        }


        try {

            /* const response_owner = await fetch(`http://localhost:2810/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response_owner.ok) {
                const body_owner = response_owner.json();
                setRequestData({ ...requestData, owner: body_owner.data});

            } else {
                // Handle error
                console.error('Failed to get owner');
            }

             */


            const response = await fetch(`http://localhost:2810/request/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                setSuccessfullyCreated(true);
                setEmptyField(false);
                // Success - handle the successful creation
                console.log('Request created successfully');
                // Reset form data
                setRequestData({
                    date: '',
                    departure: '',
                    arrival: '',
                    startHour: '',
                    endHour: '',
                    vehicleType: '',
                    vehicleId: ''
                });
            } else {
                // Handle error
                console.error(response.status);
            }
        } catch (error) {
            console.error('Error creating request:', error);
        }
    };

    return (
        <div>
            <AppNavbar/>
            <Container className="mt-5 d-flex justify-content-center">
                <Form className="create-form">
                    {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text></div>}
                    <br/>
                    <h2 className="mb-b text-center">Create Request Form</h2>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Date</Form.Label>
                        <br/>
                        <DatePicker
                            selected={requestData.date}
                            onChange={handleDateChange}
                            className="form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicDeparture">
                        <Form.Label>Departure</Form.Label>
                        <Form.Control
                            as="select"
                            name="departure"
                            value={requestData.departure}
                            onChange={handleChange}
                        >
                            <option value="">Select Departure</option>
                            {parkings.map(parking => (
                                <option key={parking.id} value={parking.name}>{parking.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    {!validDeparture && <div className="text-center"><Form.Text className="text-danger" > Departure must be different than Arrival</Form.Text></div>}
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Arrival</Form.Label>
                        <Form.Control
                            as="select"
                            name="arrival"
                            value={requestData.arrival}
                            onChange={handleChange}
                        >
                            <option value="">Select Arrival</option>
                            {parkings.map(parking => (
                                <option key={parking.id} value={parking.name}>{parking.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    {!validArrival && <div className="text-center"><Form.Text className="text-danger" > Arrival must be different than Departure</Form.Text></div>}
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Start Hour</Form.Label>
                        <Form.Control
                            type="number"
                            name="startHour"
                            placeholder="Enter start hour"
                            value={requestData.startHour}
                            onChange={handleChange}
                            min="0"
                            max="23"
                        />
                    </Form.Group>
                    {!validStartHour && <div className="text-center"><Form.Text className="text-danger" > Invalid start hour</Form.Text></div>}
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>End Hour</Form.Label>
                        <Form.Control
                            type="number"
                            name="endHour"
                            placeholder="Enter end hour"
                            value={requestData.endHour}
                            onChange={handleChange}
                            min="0"
                            max="23"
                        />
                    </Form.Group>
                    {!validEndHour && <div className="text-center"><Form.Text className="text-danger" > Invalid end hour.</Form.Text></div>}
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Vehicle Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="vehicleType"
                            value={requestData.vehicleType}
                            onChange={handleChange}
                        >
                            <option value="">Select type</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Berlina"> Berlina </option>
                            <option value="Break"> Break </option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Vehicle</Form.Label>
                        <Form.Control
                            as="select"
                            name="vehicleId"
                            value={requestData.vehicleId}
                            onChange={handleChange}
                            onClick={handleSelectVehicle}
                        >
                                <option value="">Select Vehicle</option>
                                    {vehicles.map(vehicle => (
                                <option key={vehicle.id} value={vehicle.id}>{vehicle.numberPlate}   ({vehicle.brand} {vehicle.model})</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <br/>
                    <div className="text-center">
                        <Button variant="primary" type="button" onClick={handleSubmit}>
                            Create Request
                        </Button>
                        <br/>
                        {successfullyCreated && <Form.Text className="success"> Request successfully created</Form.Text> }
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default NewRequestForm;