import React, { useState } from 'react';
import '../css/Register.css';
import AppNavbar from "./AppNavbar";
import {Button, Container, Form} from "react-bootstrap";

const RegisterForm = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [successfullyCreated, setSuccessfullyCreated] = useState(false);
    const [invalidEmailOrUsername, setInvalidEmailOrUsername] = useState(false);
    const [emptyField, setEmptyField] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if password and confirm password match
        if (userData.password !== userData.confirmPassword && userData.password.length !== 0) {
            console.error('Password and Confirm Password do not match');
            return; // Prevent form submission if passwords don't match
        }

        // Check for empty fields
        if (userData.name === '' ||
            userData.email === '' ||
            userData.username === '' ||
            userData.password === '' ||
            userData.confirmPassword === ''
        )   {
            setEmptyField(true);
            setInvalidEmailOrUsername(false);
            setSuccessfullyCreated(false);
            return;
        }

        try {
            console.log(userData);
            setEmptyField(false);
            const response = await fetch('http://localhost:2810/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                setSuccessfullyCreated(true);
                // Success - handle the successful creation
                console.log('User created successfully');
                // Reset form data
                setUserData({
                    name: '',
                    email: '',
                    username: '',
                    password: '',
                    confirmPassword: ''
                });
                setInvalidEmailOrUsername(false);
            }
            else {
                if(response.status === 409) {
                    setInvalidEmailOrUsername(true);
                    setSuccessfullyCreated(false);
                }
                // Handle error
                console.error('Failed to create user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div>
            <AppNavbar/>
            <Container className="mt-5 d-flex justify-content-center">
                <Form className="register-form">
                    {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text></div>}
                    <br/>
                    <h2 className="mb-b text-center">Register</h2>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter name"
                            value={userData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={userData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={userData.username}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={userData.password}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={userData.confirmPassword}
                            onChange={handleChange}
                        />
                        {userData.password !== userData.confirmPassword && userData.password.length > 0 && <Form.Text className="text-danger">Passwords do not match</Form.Text>}
                    </Form.Group>
                    <br/>
                    <div className="text-center">
                        <Form.Text className="">Already have an account? <a href="/login">Login now</a></Form.Text>
                        <br/>
                        <br/>
                        <Button variant="primary" type="button" onClick={handleSubmit}>
                            Create Account
                        </Button>
                        <br/>
                        {successfullyCreated && <Form.Text className="success"> User successfully created</Form.Text> }
                        {invalidEmailOrUsername && <Form.Text className="text-danger"> Invalid Username or Email Address</Form.Text> }
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default RegisterForm;
