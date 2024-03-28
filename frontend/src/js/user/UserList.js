import logo from '../../logo.svg';
import '../../css/ItemList.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import AppNavbar from "../AppNavbar";



const UserList = ({ page }) => {
    const [clients, setClients] = useState([]);

    const [totalPages, setTotalPages] = useState(0);

    const [pageSize, setPageSize] = useState(2);

    const [sortBy, setSortBy] = useState('fabricationYear');

    const [order, setOrder] = useState('asc');

    const togglePreviousPage = () => {
        window.location.href =  `/user?page=${page-1}`;
    }

    const toggleNextPage = () => {
        window.location.href =  `/user?page=${page+1}`;
    }
    const redirectToCreateUser = () => {
        window.location.href = `/register`;
    }

    const redirectToCreateRequest = (userId) => {
        window.location.href = `/user/${userId}/create-request`;
    }

    const redirectToViewUser = (id) => {
        window.location.href = `/user/${id}/view`;
    }

    const redirectToEditUser = (id) => {
        window.location.href = `/user/${id}/edit`
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
        await fetch(`/user/${id}`, {
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
                const response = await fetch(`http://localhost:2810/user`);
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
            window.location.href = '/user?page=1';
        }
    }, [page, totalPages]);
    // Calculate start and end indices for current page

    const startIndex = (page <= totalPages) ? ((page - 1) * pageSize) : 0;
    const endIndex = (page <= totalPages) ? (page * pageSize) : pageSize;
    // Get clients for current page using array slicing

    // Sort clients based on selected sorting option
    const sortedClients = [...clients].sort((a, b) => {
        const firstValue = a[sortBy];
        const secondValue = b[sortBy];

        if (order === 'asc') {
            return (firstValue.localeCompare(secondValue));
        } else {
            return (secondValue.localeCompare(firstValue));
        }

    });

    const clientsForPage = sortedClients.slice(startIndex, endIndex);

    return (
        <div>
            <AppNavbar />
            <Container className="mt-5">
                <div className="text-center">
                    <h2 className="mb-4 text-center">User List</h2>
                    <button onClick={redirectToCreateUser} className="mb-4 text-center">New User</button>
                </div>
                <div className="sorting-section">
                    <select value={sortBy} onChange={handleSortChange}>
                        <option value="username">Sort by Username</option>
                        <option value="email">Sort by Email</option>
                    </select>
                    <select value={order} onChange={handleOrderChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clientsForPage.map((client) => (
                        <tr key={client.id}>
                            <td>{client.username}</td>
                            <td>{client.email}</td>
                            <td>
                                <Button onClick={() => redirectToViewUser(client.id)} className="btn btn-info mr-2">View</Button>
                                <Button onClick={() => redirectToEditUser(client.id)} className="btn btn-warning mr-2">Edit</Button>
                                <Button className="btn btn-danger" onClick={() => remove(client.id)}>Delete</Button>
                                <Button className="btn btn-secondary" onClick={() => redirectToCreateRequest(client.id)}>Create Request</Button>
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

export default UserList;
