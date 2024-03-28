import React, { Component } from 'react';
import './css/App.css';
import Home from './js/Home';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import ParkingList from './js/parking/ParkingList';
import NewParkingForm from "./js/parking/ParkingCreate";
import EditParkingForm from "./js/parking/ParkingEdit";
import ParkingView from "./js/parking/ParkingView";
import UserList from "./js/user/UserList";
import UserView from "./js/user/UserView";
import EditUserForm from "./js/user/UserEdit";
import RegisterForm from "./js/Register";
import VehicleList from "./js/vehicle/VehicleList";
import VehicleView from "./js/vehicle/VehicleView";
import NewVehicleForm from "./js/vehicle/VehicleCreate";
import EditVehicleForm from "./js/vehicle/VehicleEdit";
import ParkingListVehicles from "./js/parking/ParkingListVehicles";
import UserListRequests from "./js/user/UserListRequests";
import UserListRides from "./js/user/UserListRides";
import RideView from "./js/ride/RideView";
import NewRequestForm from "./js/request/RequestCreate";
import LoginForm from "./js/Login";
import ResetPasswordForm from "./js/ResetPassword";
import RequestView from "./js/request/RequestView";
import EditRequestForm from "./js/request/RequestEdit";
import AdminDashboard from "./js/AdminDashboard";
import VerifyEmail from "./js/VerifyEmail";
import VerifyEmailForm from "./js/VerifyEmail";
import SendResetPasswordCodeForm from "./js/SendResetPasswordCode";

const LogRouteChanges = () => {
  const history = useHistory();

  history.listen((location, action) => {
    console.log('Route changed:', location);
    console.log('Action:', action);
  });

  return null;
};

class App extends Component {
  render() {
    return (
        <Router>
          <LogRouteChanges /> {/* Add this component */}
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/parking/create' exact={true} component={NewParkingForm}/>
            <Route
                  path='/parking/:id/edit'
                  exact={true}
                  render={(props) => (
                      <EditParkingForm {...props} parkingId={props.match.params.id} />
                  )}
            />
            <Route
                  path='/parking/:id'
                  exact={true}
                  render={(props) => (
                      <ParkingView {...props} parkingId={props.match.params.id} />
                  )}
            />
            <Route
              path='/parking/:id/vehicles'
              exact={true}
              render={({ match, location }) => {
                  const parkingId = match.params.id;
                  const searchParams = new URLSearchParams(location.search);
                  const page = parseInt(searchParams.get('page')) || 1;
                  return <ParkingListVehicles parkingId={parkingId} page={page} />;
              }}
            />
            <Route path='/parking' render={({ location }) => {
                  const searchParams = new URLSearchParams(location.search);
                  const page = parseInt(searchParams.get('page')) || 1; // Default to 1 if 'page' parameter is not present or invalid
                  return <ParkingList page={page} />;
            }} />
            <Route path='/user/:id/view'
                   exact={true}
                   render={(props) => (
                       <UserView {...props} userId={props.match.params.id} />
                   )}
            />
            <Route
                  path='/user/:id/request'
                  exact={true}
                  render={({ match, location }) => {
                      const userId = match.params.id;
                      const searchParams = new URLSearchParams(location.search);
                      const page = parseInt(searchParams.get('page')) || 1;
                      return <UserListRequests userId={userId} page={page} />;
                  }}
            />
            <Route
                  path='/user/:id/ride'
                  exact={true}
                  render={({ match, location }) => {
                      const userId = match.params.id;
                      const searchParams = new URLSearchParams(location.search);
                      const page = parseInt(searchParams.get('page')) || 1;
                      return <UserListRides userId={userId} page={page} />;
                  }}
            />
            <Route path='/user/:id/create-request'
                     exact={true}
                     render={(props) => (
                         <NewRequestForm {...props} userId={props.match.params.id} />
                     )}
            />
            <Route
                  path='/user/:id/edit'
                  exact={true}
                  render={(props) => (
                      <EditUserForm {...props} userId={props.match.params.id} />
                  )}
            />
              <Route
                  path='/user/:userId/request/:id/edit'
                  exact={true}
                  render={(props) => (
                      <EditRequestForm {...props} requestId={props.match.params.id} userId = {props.match.params.userId}/>
                  )}
              />
            <Route path='/user' render={({ location }) => {
                  const searchParams = new URLSearchParams(location.search);
                  const page = parseInt(searchParams.get('page')) || 1; // Default to 1 if 'page' parameter is not present or invalid
                  return <UserList page={page} />;
            }} />
            <Route path='/vehicle/create' exact={true} component={NewVehicleForm}/>
            <Route
                  path='/vehicle/:id'
                  exact={true}
                  render={(props) => (
                      <VehicleView {...props} vehicleId={props.match.params.id} />
                  )}
            />
            <Route
                  path='/vehicle/:id/edit'
                  exact={true}
                  render={(props) => (
                      <EditVehicleForm {...props} vehicleId={props.match.params.id} />
                  )}
            />
            <Route path='/vehicle' render={({ location }) => {
                  const searchParams = new URLSearchParams(location.search);
                  const page = parseInt(searchParams.get('page')) || 1;
                  return <VehicleList page={page} />;
            }} />
            <Route
                  path='/ride/:id'
                  exact={true}
                  render={(props) => (
                      <RideView {...props} rideId={props.match.params.id} />
                  )}
            />
            <Route
                  path='/request/:id'
                  exact={true}
                  render={(props) => (
                      <RequestView {...props} requestId={props.match.params.id} />
                  )}
            />


            <Route path='/register' exact={true} component={RegisterForm}/>
            <Route path='/login' exact={true} component={LoginForm} />
            <Route path='/send-reset-password-code' exact={true} component={SendResetPasswordCodeForm}/>
            <Route path='/reset-your-password' exact={true} component={ResetPasswordForm}/>
            <Route path='/admin-dashboard' exact={true} component={AdminDashboard}/>
            <Route path='/verify-email' exact={true} component={VerifyEmailForm}/>
          </Switch>
        </Router>
    );
  }
}

export default App;
