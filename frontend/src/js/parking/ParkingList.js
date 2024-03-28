import logo from '../../logo.svg';
import '../../css/ItemList.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import AppNavbar from "../AppNavbar";
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from "@react-google-maps/api";



const ParkingList = ({ page }) => {
    const [clients, setClients] = useState([]);

    const [totalPages, setTotalPages] = useState(0);

    const [pageSize, setPageSize] = useState(2);

    const [sortBy, setSortBy] = useState('name');

    const [order, setOrder] = useState('asc');

    const [selectedParking, setSelectedParking] = useState(null);
    const center = { lat: 47.164775, lng: 27.580579 };
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "",
    });
    const togglePreviousPage = () => {
        window.location.href =  `/parking?page=${page-1}`;
    }

    const toggleNextPage = () => {
        window.location.href =  `/parking?page=${page+1}`;
    }
    const redirectToCreateParking = () => {
        window.location.href = `/parking/create`;
    }

    const redirectToViewParking = (id) => {
        window.location.href = `/parking/${id}`;
    }

    const redirectToEditParking = (id) => {
        window.location.href = `/parking/${id}/edit`
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
        await fetch(`/parking/${id}`, {
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
                //const myPage = parseInt(page);
                //console.log(myPage);
                //const response = await fetch(`http://localhost:2810/parking/getPage?page=${myPage}`);
                const response = await fetch(`http://localhost:2810/parking`);
                const body = await response.json();
                console.log('Response:', body);
                setClients(body);
                const clientsSize = body.length;
                setTotalPages(Math.ceil(clientsSize / pageSize));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [page]);

    useEffect(() => {
        // Redirect to the first page if the requested page number exceeds the total pages
        if ((page > totalPages && totalPages > 0) || page < 1) {
            window.location.href = '/parking?page=1';
        }
    }, [page, totalPages]);
    // Calculate start and end indices for current page

    console.log(totalPages);
    const startIndex = (page <= totalPages) ? ((page - 1) * pageSize) : 0;
    const endIndex = (page <= totalPages) ? (page * pageSize) : pageSize;
    // Get clients for current page using array slicing

    // Sort clients based on selected sorting option
    const sortedClients = [...clients].sort((a, b) => {
        const firstValue = a[sortBy];
        const secondValue = b[sortBy];

        if (sortBy === 'name') {
            if (order === 'asc') {
                return firstValue.localeCompare(secondValue);
            } else {
                return secondValue.localeCompare(firstValue);
            }
        } else {
            if (order === 'asc') {
                return firstValue - secondValue;
            } else {
                return secondValue - firstValue;
            }
        }
    });

    const clientsForPage = sortedClients.slice(startIndex, endIndex);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <AppNavbar />
            <div style={{ display: 'flex', height: '90vh' }}>
                <div style={{ flex: 2, position: 'relative', border: '1px solid black'}}>
                    <div style={{  border: '1px solid black', padding: '10px'}}>
                        <Container className="mt-5">
                        <div className="text-center">
                            <h2 className="mb-4 text-center">Parking List</h2>
                            <button onClick={redirectToCreateParking} className="mb-4 text-center">New Parking</button>
                        </div>
                        {/* Sorting section */}
                        <div className="sorting-section">
                            <select value={sortBy} onChange={handleSortChange}>
                                <option value="name">Sort by Name</option>
                                <option value="maxCapacity">Sort by Max Capacity</option>
                            </select>
                            <select value={order} onChange={handleOrderChange}>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Max Capacity</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {clientsForPage.map((client) => (
                                <tr key={client.id}>
                                    <td>{client.name}</td>
                                    <td>{client.maxCapacity}</td>
                                    <td>
                                        <Button onClick={() => redirectToViewParking(client.id)} className="btn btn-info mr-2">View</Button>
                                        <Button onClick={() => redirectToEditParking(client.id)} className="btn btn-warning mr-2">Edit</Button>
                                        <Button className="btn btn-danger" onClick={() => remove(client.id)}>Delete</Button>
                                    </td>
                                   {/* <td>
                                        <Button color="link">
                                             Add/remove vehicle buttons
                                        </Button>
                                    </td>*/}
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
                </div>
                <div style={{ flex: 3, position: 'relative', border: '1px solid black'}}>
                    <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px', border: '1px solid black', overflow: 'hidden'}}>

                        <GoogleMap center={center} zoom={12} mapContainerStyle={{ width: '100%', height: '100%', border: '3px solid black', overflow: 'hidden'}}>
                            {clients.map(parking => (
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
}

export default ParkingList;
