import logo from '../../logo.svg';
import React, {Component, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {Button, Container} from 'reactstrap';
import '../../css/ItemList.css';
import AppNavbar from "../AppNavbar";


const UserListRides = ({userId, page}) => {
    const [rides, setRides] = useState([]);
    const [user, setUser] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const [pageSize, setPageSize] = useState(2);

    const [sortBy, setSortBy] = useState('date');

    const [order, setOrder] = useState('asc');


    const togglePreviousPage = () => {
        window.location.href =  `/user/${userId}/ride?page=${page-1}`;
    }

    const toggleNextPage = () => {
        window.location.href =  `/user/${userId}/ride?page=${page+1}`;
    }

    const redirectToViewRide = (id) =>{
        window.location.href = `/ride/${id}`;
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseRide = await fetch(`http://localhost:2810/user/${userId}/ride`);
                const responseUser = await fetch(`http://localhost:2810/user/${userId}`);
                const bodyRide = await responseRide.json();
                const bodyUser = await responseUser.json();
                setRides(bodyRide);
                setUser(bodyUser);
                const clientsSize = bodyRide.length;
                setTotalPages(Math.ceil(clientsSize / pageSize));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [userId]);

    useEffect(() => {
        // Redirect to the first page if the requested page number exceeds the total pages
        if ((page > totalPages && totalPages > 0) || page < 1) {
            window.location.href = `/user/${userId}/ride?page=1`;
        }
    }, [page, totalPages]);

    const startIndex = (page <= totalPages) ? ((page - 1) * pageSize) : 0;
    const endIndex = (page <= totalPages) ? (page * pageSize) : pageSize;
    // Get clients for current page using array slicing

    const sortedRides = [...rides].sort((a, b) => {
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
    const ridesForPage = sortedRides.slice(startIndex, endIndex);
    //console.log(ridesForPage);

    return (
             <div>
                <AppNavbar />
                <Container className="mt-5">
                    <div className="text-center">
                        <h2 className="mb-4 text-center">Rides of user { user ? user.username : ''}</h2>
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
                        {ridesForPage.map((client) => (
                            <tr key={client.id}>
                                <td>{client.date}</td>
                                <td>{client.departure}</td>
                                <td>{client.arrival}</td>
                                <td>
                                    <button onClick={() => redirectToViewRide(client.id)} className="btn btn-info mr-2">View</button>
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

export default UserListRides;
