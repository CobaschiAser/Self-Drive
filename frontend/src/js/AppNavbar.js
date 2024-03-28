import React, {Component} from 'react';
import {Navbar, NavbarBrand} from 'reactstrap';
import {Link} from 'react-router-dom';
import logo from '../assets/logo.jpg';
export default class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        this.toggle = this.toggle.bind(this);
        //this.toggleRegister = this.toggleRegister.bind(this);
    }

    toggleHome() {
        window.location.href = '/';
    }
    toggleRegister(){
        window.location.href = '/register';
    }

    toggleAboutUs() {
        window.location.href = '/about-us';
    }

    toggleLogin() {
        window.location.href ='/login';
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return <Navbar color="dark" dark expand="md" style={{ display: 'flex', alignItems: 'center' }}>
            <NavbarBrand tag={Link} to="/" onClick={this.toggleHome}>
                <img src={logo} style={{ marginRight: '10px', height: "50px" }}  alt={logo}/>
            </NavbarBrand>
            <NavbarBrand tag={Link} to="/" onClick={this.toggleHome}> Home</NavbarBrand>
            <NavbarBrand tag={Link} to="/register" onClick={this.toggleRegister}> Register</NavbarBrand>
            <NavbarBrand tag={Link} to="/about-us" onClick={this.toggleAboutUs}> About Us</NavbarBrand>
            <NavbarBrand tag={Link} to="/login" onClick={this.toggleLogin}> Sign In</NavbarBrand>
        </Navbar>;
    }
}