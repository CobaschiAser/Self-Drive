import React, { Component } from 'react';
import '../css/Home.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

class Home extends Component {
    render() {
        return (
            <div>
                <AppNavbar/>
                <Container fluid className="Home-container">
                    <Button><Link to="/parking">Parking</Link></Button>
                    <Button><Link to="/user">User</Link></Button>
                    <Button><Link to="/vehicle">Vehicle</Link></Button>
                </Container>

            </div>
        );
    }
}
export default Home;