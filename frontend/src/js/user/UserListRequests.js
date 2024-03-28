import logo from '../../logo.svg';
import React, {Component, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {Button, Container} from 'reactstrap';
import '../../css/ItemList.css';
import AppNavbar from "../AppNavbar";


const UserListRequests = ({userId, page}) => {
    const [requests, setRequests] = useState([]);
    const [user, setUser] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const [pageSize, setPageSize] = useState(2);

    const [sortBy, setSortBy] = useState('date');

    const [order, setOrder] = useState('asc');


    const togglePreviousPage = () => {
        window.location.href =  `/user/${userId}/request?page=${page-1}`;
    }

    const toggleNextPage = () => {
        window.location.href =  `/user/${userId}/request?page=${page+1}`;
    }

    const redirectToViewRequest = (id) =>{
        window.location.href = `/request/${id}`;
    }

    const redirectToEditRequest = (userId, id) => {
        window.location.href = `/user/${userId}/request/${id}/edit`;
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

    const startRequest = async(userId,id) => {
        await fetch(`/request/${id}/start`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            window.location.href = `/user/${userId}/request`
        });

    };

    const finishRequest = async (userId,id) => {
        await fetch(`/request/${id}/finish`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            window.location.href = `/user/${userId}/request`
        });

    };
    const remove = async (id) => {
        await fetch(`/request/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedRequests = requests.filter(i => i.id !== id);
            setRequests(updatedRequests);
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseRequests = await fetch(`http://localhost:2810/user/${userId}/request`);
                const responseUser = await fetch(`http://localhost:2810/user/${userId}`);
                const bodyRequests = await responseRequests.json();
                const bodyUser = await responseUser.json();
                setRequests(bodyRequests);
                setUser(bodyUser);
                const clientsSize = bodyRequests.length;
                setTotalPages(Math.ceil(clientsSize / pageSize));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [userId]);
    console.log(user);

    useEffect(() => {
        // Redirect to the first page if the requested page number exceeds the total pages
        if ((page > totalPages && totalPages > 0) || page < 1) {
            window.location.href = `/user/${userId}/request?page=1`;
        }
    }, [page, totalPages]);

    const startIndex = (page <= totalPages) ? ((page - 1) * pageSize) : 0;
    const endIndex = (page <= totalPages) ? (page * pageSize) : pageSize;
    // Get clients for current page using array slicing

    const sortedRequests = [...requests].sort((a, b) => {
        const firstValue = a[sortBy];
        const secondValue = b[sortBy];

        if (sortBy === 'date') {
            if (order === 'asc') {
                return firstValue.localeCompare(secondValue);
            } else {
                return secondValue.localeCompare(firstValue);
            }
        }
        /*else {
            if (order === 'asc') {
                return firstValue - secondValue;
            } else {
                return secondValue - firstValue;
            }
        }*/
    });
    //console.log(sortedRides);
    const requestsForPage = sortedRequests.slice(startIndex, endIndex);
    console.log(requestsForPage);
    console.log(user);

    return (
        <div>
            <AppNavbar />
            <Container className="mt-5">
                <div className="text-center">
                    <h2 className="mb-4 text-center">Requests of user {user ? user.username : ''}</h2>
                </div>
                <div className="sorting-section">
                    <select value={sortBy} onChange={handleSortChange}>
                        <option value="date">Sort by Date</option>
                        {/*<option value="maxAutonomy">Sort by Max Autonomy</option>*/}
                    </select>
                    <select value={order} onChange={handleOrderChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requestsForPage.map((client) => (
                        <tr key={client.id}>
                            <td>{client.date}</td>
                            <td>{client.departure}</td>
                            <td>{client.arrival}</td>
                            <td>
                                <button onClick={() => redirectToViewRequest(client.id)} className="btn btn-info mr-2">View</button>
                                {!client.started && <button onClick={() => redirectToEditRequest(userId, client.id)} className="btn btn-warning mr-2">Edit</button>}
                                {!client.started && <button className="btn btn-danger" onClick={() => remove(client.id)}>Delete</button>}
                                {!client.started && <button className="btn btn-secondary" onClick={() => startRequest(userId, client.id)}>Start Request</button> }
                                {client.started && !client.solved && <button className="btn btn-success" onClick={() => finishRequest(user.id, client.id)}>Finish Request</button> }
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

export default UserListRequests;
