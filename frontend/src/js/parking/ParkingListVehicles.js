/*
import logo from '../../logo.svg';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Button, Container} from 'reactstrap';
import '../../css/ItemList.css';
import AppNavbar from "../AppNavbar";


class ParkingListVehicles extends Component {
    state = {
        clients: [],
        parking: []
    };

    redirectToViewVehicle(id) {
        window.location.href = `/vehicle/${id}`;
    }

    redirectToEditVehicle(id) {
        window.location.href = `/vehicle/${id}/edit`;
    }

    async remove(id) {
        await fetch(`/vehicle/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedClients = [...this.state.clients].filter(i => i.id !== id);
            this.setState({clients: updatedClients});
        });
    }

    async componentDidMount() {
        try {
            const parkingId = this.props.parkingId;

            const response = await fetch(`http://localhost:2810/parking/${parkingId}/vehicles`);
            const response_parking = await fetch(`http://localhost:2810/parking/byId/${parkingId}`);
            const body = await response.json();
            const body_parking = await response_parking.json();
            console.log('Response:', body); // Log the response here
            console.log('Respone_parking:', body_parking);
            this.setState({ clients: body , parking: body_parking});
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    render() {
        const { clients, parking } = this.state;
        return (
            <div>
                <AppNavbar/>
                <Container className="mt-5">
                    <h2 className="mb-4 text-center">Vehicles of parking {parking.name}</h2>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Make</th>
                            <th>Model</th>
                        </tr>
                        </thead>
                        <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.brand}</td>
                                <td>{client.model}</td>
                                <td>
                                    <Button color="link">
                                        <button onClick={() => this.redirectToViewVehicle(client.id)} className="btn btn-info mr-2">View</button>
                                        <button onClick={() => this.redirectToEditVehicle(client.id)} className="btn btn-warning mr-2">Edit</button>
                                        <button onClick={() => this.remove(client.id)} className="btn btn-danger">Delete</button>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Container>
            </div>
        );
    }
}

export default ParkingListVehicles;
*/

import React, { useState, useEffect } from 'react';
import { Button, Container } from 'reactstrap';
import AppNavbar from "../AppNavbar";

const ParkingListVehicles = ({ parkingId , page }) => {
    const [clients, setClients] = useState([]);
    const [parking, setParking] = useState(null);

    const [totalPages, setTotalPages] = useState(0);

    const [pageSize, setPageSize] = useState(2);

    const [sortBy, setSortBy] = useState('fabricationYear');

    const [order, setOrder] = useState('asc');

    const togglePreviousPage = () => {
        window.location.href =  `/parking/${parkingId}/vehicles?page=${page-1}`;
    }

    const toggleNextPage = () => {
        window.location.href =  `/parking/${parkingId}/vehicles?page=${page+1}`;
    }
    const redirectToViewVehicle = (id) => {
        window.location.href = `/vehicle/${id}`;
    }

    const redirectToEditVehicle = (id) => {
        window.location.href = `/vehicle/${id}/edit`;
    }

    const handleSortChange = (event) => {
        const { value } = event.target;
        setSortBy(value);
    }

    // Function to handle sorting order change
    const handleOrderChange = (event) => {
        const { value } = event.target;
        setOrder(value);
    }

    const remove = async (id) => {
        await fetch(`/vehicle/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedClients = clients.filter(i => i.id !== id);
            setClients(updatedClients);
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:2810/parking/${parkingId}/vehicles`);
                const responseParking = await fetch(`http://localhost:2810/parking/byId/${parkingId}`);
                const body = await response.json();
                const bodyParking = await responseParking.json();
                console.log('Response:', body);
                console.log('Response Parking:', bodyParking);
                setClients(body);
                setParking(bodyParking);
                const clientsSize = body.length;
                setTotalPages(Math.ceil(clientsSize / pageSize));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [parkingId]);

    useEffect(() => {
        // Redirect to the first page if the requested page number exceeds the total pages
        if ((page > totalPages && totalPages > 0) || page < 1) {
            window.location.href = `/parking/${parkingId}/vehicles?page=1`;
        }
    }, [page, totalPages]);

    console.log(totalPages);
    const startIndex = (page <= totalPages) ? ((page - 1) * pageSize) : 0;
    const endIndex = (page <= totalPages) ? (page * pageSize) : pageSize;
    // Get clients for current page using array slicing

    const sortedClients = [...clients].sort((a, b) => {
        const firstValue = a[sortBy];
        const secondValue = b[sortBy];

        //if (sortBy === 'fabricationYear') {
        if (order === 'asc') {
            return firstValue - secondValue;
        } else {
            return secondValue - firstValue;
        }
        //}
        /*else {
            if (order === 'asc') {
                return firstValue - secondValue;
            } else {
                return secondValue - firstValue;
            }
        }*/
    });
    console.log(sortedClients);
    const clientsForPage = sortedClients.slice(startIndex, endIndex);
    console.log(clientsForPage);


    return (
        <div>
            <AppNavbar />
            <Container className="mt-5">
                <h2 className="mb-4 text-center">Vehicles of parking {parking ? parking.name : ''}</h2>
                <div className="sorting-section">
                    <select value={sortBy} onChange={handleSortChange}>
                        <option value="fabricationYear">Sort by Fabrication Year</option>
                        <option value="maxAutonomy">Sort by Max Autonomy</option>
                    </select>
                    <select value={order} onChange={handleOrderChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    {/*<Button onClick={handleOrderChange}>Toggle Sort Order</Button>
                */}
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Make</th>
                        <th>Model</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {clientsForPage.map((client) => (
                        <tr key={client.id}>
                            <td>{client.brand}</td>
                            <td>{client.model}</td>
                            <td>
                                <Button color="link">
                                    <button onClick={() => redirectToViewVehicle(client.id)} className="btn btn-info mr-2">View</button>
                                    <button onClick={() => redirectToEditVehicle(client.id)} className="btn btn-warning mr-2">Edit</button>
                                    <button onClick={() => remove(client.id)} className="btn btn-danger">Delete</button>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="pagination">
                    {page > 1 && (
                        <Button to={`/parking?page=${page - 1}`} className="btn btn-primary" onClick={togglePreviousPage}>
                            Previous
                        </Button>
                    )}
                    {page < totalPages && (
                        <Button to={`/parking?page=${page + 1}`} className="btn btn-primary" onClick={toggleNextPage}>
                            Next
                        </Button>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default ParkingListVehicles;

