import React, {useState} from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css';
const AdminSidebar = () => {
    const [vehicleSubMenuVisible, setVehicleSubMenuVisible] = useState(false);
    const [profileSubMenuVisible, setProfileSubMenuVisible] = useState(false);
    const [userSubMenuVisible, setUserSubMenuVisible] = useState(false);
    const [parkingSubMenuVisible, setParkingSubMenuVisible] = useState(false);
    const toggleVehicleSubMenu = (event) => {
        event.preventDefault();
        setVehicleSubMenuVisible(!vehicleSubMenuVisible);
    };

    const toggleProfileSubMenu = (event) => {
        event.preventDefault();
        setProfileSubMenuVisible(!profileSubMenuVisible);
    }

    const toggleUserSubMenu = (event) =>{
        event.preventDefault();
        setUserSubMenuVisible(!userSubMenuVisible);
    }

    const toggleParkingSubMenu = (event) => {
        event.preventDefault();
        setParkingSubMenuVisible(!parkingSubMenuVisible);
    }

    return (
        <div className="d-flex justify-content-between flex-column bg-light text-white p-3" style={{border: "1px solid black"}}>
            <a href="">
                <i className="bi bi-code-slash fs-4 me-4"></i>
                <span className="fs-4">-SelfDrive-</span> <br/>
                <span className="fs-5">Admin Dashboard</span>
            </a>
            <hr className="text-secondary"/>
            <ul className="nav nav-pills flex-column">
                <li className="nav-item">
                    <a href="/admin-dashboard">
                        <i className="bi bi-speedometer2 me-3"></i>
                        <span><strong>Dashboard</strong></span>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" onClick={toggleProfileSubMenu}>
                        <i className="bi bi-person-rolodex me-3"></i>
                        <span><strong>Profile</strong></span>
                        {profileSubMenuVisible ? (
                            <i className="bi bi-caret-up ms-auto"></i>
                        ) : (
                            <i className="bi bi-caret-down ms-auto"></i>
                        )}
                    </a>
                    {profileSubMenuVisible && (
                        <ul className="nav flex-column ps-5">
                            <li className="nav-item">
                                <a href="#">
                                    <span>View Profile</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#">
                                    <span>Edit Profile</span>
                                </a>
                            </li>
                        </ul>
                    )}
                </li>
                <li className="nav-item">
                    <a href="#" onClick={toggleUserSubMenu}>
                        <i className="bi bi-people me-3"></i>
                        <span><strong>User</strong></span>
                        {userSubMenuVisible ? (
                            <i className="bi bi-caret-up ms-auto"></i>
                        ) : (
                            <i className="bi bi-caret-down ms-auto"></i>
                        )}
                    </a>
                    {userSubMenuVisible && (
                        <ul className="nav flex-column ps-5">
                            <li className="nav-item">
                                <a href="/user">
                                    <span>Inspect Users</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#">
                                    <span>View Statistics</span>
                                </a>
                            </li>
                        </ul>
                    )}
                </li>

                <li className="nav-item">
                    <a href="#" onClick={toggleVehicleSubMenu}>
                        <i className="bi bi-car-front me-3"></i>
                        <span><strong>Vehicle</strong></span>
                        {vehicleSubMenuVisible ? (
                            <i className="bi bi-caret-up ms-auto"></i>
                        ) : (
                            <i className="bi bi-caret-down ms-auto"></i>
                        )}
                    </a>
                    {vehicleSubMenuVisible && (
                        <ul className="nav flex-column ps-5">
                            <li className="nav-item">
                                <a href="/vehicle?page=1">
                                    <span>Inspect Vehicles</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/vehicle/create">
                                    <span>Create Vehicle</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#">
                                    <span>View Statistics</span>
                                </a>
                            </li>
                        </ul>
                    )}
                </li>

                <li className="nav-item">
                    <a href="#" onClick={toggleParkingSubMenu}>
                        <i className="bi bi-p-circle me-3"></i>
                        <span><strong>Parking</strong></span>
                        {parkingSubMenuVisible ? (
                            <i className="bi bi-caret-up ms-auto"></i>
                        ) : (
                            <i className="bi bi-caret-down ms-auto"></i>
                        )}
                    </a>
                    {parkingSubMenuVisible && (
                        <ul className="nav flex-column ps-5">
                            <li className="nav-item">
                                <a href="/parking?page=1">
                                    <span>Inspect Parkings</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/parking/create">
                                    <span>Create Parking</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#">
                                    <span>View Statistics</span>
                                </a>
                            </li>
                        </ul>
                    )}
                </li>

            </ul>
        </div>
    )
}

export default AdminSidebar;