import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services.js';
import {
  BikeTypes,
  BikeTypeDetails,
  NewBikeType,
  BikeStatus,
  BikesByStatus,
  LocationList,
  BikesOnLocation,
  AllBikes,
  AddBikes,
  SelectedBike
} from './bikes.js';

import { UserInfo, EditUserInfo, MineSalg, Bestilling } from './minSide';
import { Customers, AddCustomer } from './customer.js';
import { Booking } from './booking.js';
import { Basket } from './basket.js';
import { Overview } from './overview.js';
import { Orders } from './orders.js';

import {
  Card,
  Tabs,
  Link,
  Row,
  Column,
  NavBar,
  SideNavBar,
  SideNavHeading,
  Button,
  Form,
  CenterContent
} from './widgets';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faCoffee,
  faShoppingCart,
  faBicycle,
  faCalendar,
  faMapMarkerAlt,
  faUsers,
  faFile
} from '@fortawesome/free-solid-svg-icons';

library.add(faCoffee, faChartPie, faShoppingCart, faBicycle, faCalendar, faMapMarkerAlt, faUsers, faFile);

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

/*
  HER SKAL ALLE ELEMENTER SETTES SAMMEN TIL FOR Å LAGE SELVE APPLIKASJONEN

  BRUKER IMPORT AV ELEMENTER SOM TRENGS FRA ANDRE .JS FILER
*/
export let basket = [];
export let employeeID = 1;
export const activeCustomer = React.createContext('');

/* Denne er her fordi om jeg det ikke blir pushet til en komponent,
så ser du alt av innhold fra tidligere komponenter selv etter utlogging */
class LoginMenu extends Component {
  render() {
    return <div />;
  }
}

/* Set state for menyen. Hva vises, alt etter hvem som er logget inn */
class Menu extends Component {
  state = {
    isLoggedIn: true,
    menu: false,
    username: '',
    password: '',
    userinfo: null
  }; //Endre denne til false for å starte med innloggings portalen ved oppstart av applikasjon

  toggleMenu() {
    this.setState({ menu: !this.state.menu });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    const show = this.state.menu ? 'show' : '';

    if (isLoggedIn == false) {
      history.push('/login/');
      return (
        <div>
          <NavBar brand="CycleOn Rentals" />
          <CenterContent>
            <Card header="Logg inn">
              <form onSubmit={this.login}>
                <div className="input-group form-group">
                  <Form.Input
                    type="text"
                    onChange={event => (this.state.username = event.target.value)}
                    className="form-control"
                    placeholder="Employee Username"
                  />
                </div>
                <div className="input-group form-group">
                  <Form.Input
                    type="password"
                    onChange={event => (this.state.password = event.target.value)}
                    className="form-control"
                    placeholder="Password"
                  />
                </div>
                <div className="form-group">
                  <Form.Input type="submit" value="Login" className="btn float-right login_btn" />
                </div>
              </form>
            </Card>
          </CenterContent>
        </div>
      );
    } else {
      return (
        <div>
          <NavBar brand="CycleOn Rentals">
            <Button.Danger onClick={this.logout}>Logg ut</Button.Danger>
          </NavBar>
          <div>
            <Row>
              <SideNavBar>
                <SideNavHeading>
                  <span>MENY</span>
                </SideNavHeading>
                <SideNavBar.SideLink to="/overview/">
                  <FontAwesomeIcon className="navIcon" icon="chart-pie" />
                  Oversikt
                </SideNavBar.SideLink>
                <SideNavBar.SideLink to="/booking/">
                  <FontAwesomeIcon className="navIcon" icon="calendar" />
                  Booking
                </SideNavBar.SideLink>
                <SideNavBar.SideLink to="/locations/1">
                  <FontAwesomeIcon className="navIcon" icon="map-marker-alt" />
                  Lokasjoner
                </SideNavBar.SideLink>
                <SideNavBar.SideLink to="/allBikes/" onClick={this.toggleMenu}>
                  <FontAwesomeIcon className="navIcon" icon="bicycle" />
                  Sykler
                </SideNavBar.SideLink>

                <div className={'collapse navbar-collapse ' + show}>
                  <div id="subLinks">
                    <SideNavBar.SideLink to="/bikeTypes/Terreng">- Etter sykkeltype</SideNavBar.SideLink>
                    <SideNavBar.SideLink to="/locations/1">- Etter lokasjon</SideNavBar.SideLink>
                    <SideNavBar.SideLink to="/bikeStatus/OK">- Etter status</SideNavBar.SideLink>
                  </div>
                </div>
                <SideNavBar.SideLink to="/orders/">
                  <FontAwesomeIcon className="navIcon" icon="file" />
                  Ordrer
                </SideNavBar.SideLink>
                <SideNavBar.SideLink to="/customers/">
                  <FontAwesomeIcon className="navIcon" icon="users" />
                  Kundeliste
                </SideNavBar.SideLink>
                <SideNavBar.SideLink to="/basket/">
                  <FontAwesomeIcon className="navIcon" icon="shopping-cart" />
                  Handlekurv
                </SideNavBar.SideLink>
                <SideNavHeading>
                  <span>MIN SIDE</span>
                </SideNavHeading>
                <SideNavBar.SideLink to="/information/">Informasjon</SideNavBar.SideLink>
                <SideNavBar.SideLink to="/MineSalg">Mine salg</SideNavBar.SideLink>
              </SideNavBar>
            </Row>
          </div>
        </div>
      );
    }
  }

  //DENNE TRENGES MER ARBEID MED, foreløbig virkning med ukryptert passord
  login() {
    rentalService.getLoginInfo(this.state.username, results => {
      this.setState({ state: (this.state.userinfo = results[0]) });

      if (
        this.state.username == null ||
        this.state.password == null ||
        this.state.username == '' ||
        this.state.password == ''
      ) {
        alert('One or more fields are empty, Please try again');
      } else if (this.state.password != this.state.userinfo.password) {
        alert('Password is wrong, contact Admin');
      } else if (this.state.password == this.state.userinfo.password) {
        employeeID = this.state.userinfo.user_id;
        this.setState({ isLoggedIn: true });
        history.push('/overview/');
      } else {
        alert('log in name or password was wrong');
      }
    });
    console.log(this.state.password);
  }

  logout() {
    // history.push('/login/');
    this.setState({ isLoggedIn: false });
    this.state.username = '';
    this.state.password = '';
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu isLoggedIn={true} />
      <Route exact path="/login/" component={LoginMenu} />
      <Route exact path="/overview/" component={Overview} />
      <Route path="/booking/" component={Booking} />

      <Route exact path="/allBikes/" component={AllBikes} />
      <Route path="/bikeTypes/" component={BikeTypes} />
      <Route exact path="/bikeTypes/add/" component={NewBikeType} />
      <Route exact path="/bikeTypes/:typeName/" component={BikeTypeDetails} />
      <Route exact path="/addBikes/" component={AddBikes} />
      <Route exact path="/selectedBike/:id" component={SelectedBike} />

      <Route path="/bikeStatus/" component={BikeStatus} />
      <Route exact path="/bikeStatus/:bikeStatus/" component={BikesByStatus} />
      <Route path="/orders/" component={Orders} />
      <Route path="/customers/" component={Customers} />
      <Route exact path="/customers/add" component={AddCustomer} />

      <Route path="/locations/" component={LocationList} />
      <Route exact path="/locations/:id" component={BikesOnLocation} />
      <Route exact path="/locations/add" component={NewLocation} />

      <Route exact path="/basket/" component={Basket} />

      <Route exact path="/information/" component={UserInfo} />
      <Route exact path="/EditUserInfo" component={EditUserInfo} />
      <Route exact path="/MineSalg/" component={MineSalg} />
      <Route path="/MineSalg/:id/edit" component={Bestilling} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
