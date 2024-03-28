import React, { useState } from 'react';
import '../css/Login.css';
import AppNavbar from "./AppNavbar";
import { Container, Form, Button } from 'react-bootstrap';

const LoginForm = () => {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
    });

    const [emptyField, setEmptyField] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [verified, setVerified] = useState(true);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    function toggleVerifyEmail(){
        window.location.href = "/verify-email";
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if( userData.username === '' || userData.password === ''){
            setEmptyField(true);
            setInvalid(false);
            setVerified(true);
            return;
        }

        try {
            setEmptyField(false);
            const response = await fetch('http://localhost:2810/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                // Success - handle the successful creation
                console.log('User logged in successfully');
                // Reset form data
                setUserData({
                    username: '',
                    password: ''
                });
                setInvalid(false);
                setVerified(true);
            } else {
                if (response.status === 401) {
                    setInvalid(true);
                    setVerified(true);
                }
                if (response.status === 423) {
                    setInvalid(false);
                    setVerified(false);
                }
                // Handle error
                console.error('Failed to login user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div>
        <AppNavbar/>
        <Container className="mt-5 d-flex justify-content-center">
            <Form className="login-form">
                {emptyField && <div className="text-center"><Form.Text className="text-danger" > Please fill empty fields</Form.Text><br/></div>}
                {invalid && <div className="text-center"><Form.Text className="text-danger" > Invalid username or password</Form.Text><br/></div>}
                {!verified && <div className="text-center"><Form.Text className="text-danger" > You cannot access your account <br/> until you <a href = "/verify-email" onClick={toggleVerifyEmail}> verify</a> your email</Form.Text><br/></div>}
                <h2 className="mb-b text-center">Login</h2>
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
                <br/>
                <div className="text-center">
                    <Form.Text className="">You don't have an account? <a href="/register">Register now</a></Form.Text>
                    <br/>
                    <Form.Text className="">Forgot your password? <a href="/send-reset-password-code">Reset it now</a></Form.Text>
                    <br/>
                    <br/>
                    <Button variant="primary" type="button" onClick={handleSubmit}>
                        Login
                    </Button>
                </div>
            </Form>
        </Container>
        </div>
    );
};

export default LoginForm;
