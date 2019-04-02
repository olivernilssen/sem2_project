import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, ButtonOutline, Form, Table, ClickTable, H1 } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { customerService } from './services/customersService';
import { basket, employeeID } from './index.js';
import { Modal } from 'react-bootstrap';
require('react-bootstrap/ModalHeader');
require('react-bootstrap/Modal');

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class Customers extends Component {
  state = {
    customers: [],
    searchWord: '',
    activeCustomer: null
  };

  onChangeHandle(event) {
    this.setState({ state: (this.state.searchWord = event.target.value) }, this.searchCustomer());
  }

  searchCustomer() {
    let word = '%' + this.state.searchWord + '%';

    customerService.getCustomerSearch(word, results => {
      this.setState(state => {
        this.state.customers = [];
        const customers = state.customers.concat(results);
        return { customers, results };
      });
    });
  }

  chooseActive(customer) {
    let index = this.state.customers
      .map(function(e) {
        return e.id;
      })
      .indexOf(customer.id);

    for (let i = 0; i < this.state.customers.length; i++) {
      this.state.customers[i].selectedCust = false;
    }

    this.state.customers[index].selectedCust = true;

    customerService.getCustomer(customer.id, result => {
      this.setState({ state: (this.state.activeCustomer = result) });
    });
  }

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Kundeliste</h1>
        </NavBar>

        <Column right>
          <NavLink to="/addCustomer">
            <Button.Light>Legg til ny kunde</Button.Light>
          </NavLink>
        </Column>
        <Card>
          <Row>
            <Column width={5}>
              <Form.Input id="testSearch" type="search" onChange={this.onChangeHandle} placeholder="Søk etter kunde" />
              <br />
              <ClickTable>
                <ClickTable.Thead>
                  <ClickTable.Th>KundeID</ClickTable.Th>
                  <ClickTable.Th>Fornavn</ClickTable.Th>
                  <ClickTable.Th>Etternavn</ClickTable.Th>
                </ClickTable.Thead>
                <ClickTable.Tbody>
                  {this.state.customers.map(customer => (
                    <ClickTable.Tr
                      style={customer.selectedCust ? { backgroundColor: '#c5e0e4' } : { backgroundColor: '' }}
                      key={customer.id}
                      onClick={() => {
                        this.chooseActive(customer);
                      }}
                    >
                      <ClickTable.Td>{customer.id}</ClickTable.Td>
                      <ClickTable.Td>{customer.firstName}</ClickTable.Td>
                      <ClickTable.Td>{customer.lastName}</ClickTable.Td>
                    </ClickTable.Tr>
                  ))}
                </ClickTable.Tbody>
              </ClickTable>
            </Column>
            <Column>
              <SelectedCustomer activeCustomer={this.state.activeCustomer} />
            </Column>
          </Row>
        </Card>
        <br />
      </div>
    );
  }

  mounted() {
    customerService.getCustomerSearch('%', results => {
      for (let i = 0; i < results.length; i++) {
        if (i == 0) {
          results[i].selectedCust = true;
        } else {
          results[i].selectedCust = false;
        }
      }
      this.state.customers = results;
    });

    customerService.getCustomer('1', result => {
      this.setState({ activeCustomer: result });
    });
  }
}

class SelectedCustomer extends Component {
  state = {
    customer: this.props.activeCustomer
  };

  active = '';
  ordersByCustomer = [];

  componentWillReceiveProps(nextProps) {
    this.setState({
      customer: nextProps.activeCustomer,
      change: false,
      allOrders: false,
      showConfirm: false,
      showError: false
    });

    this.active = nextProps.activeCustomer;
  }

  handleClose() {
    this.setState({ showError: false });
    this.setState({ showConfirm: false });
  }

  handleShow() {
    if (
      this.active.firstName == '' ||
      this.active.lastName == '' ||
      this.active.email == '' ||
      this.active.tlf == '' ||
      this.active.streetAddress == '' ||
      this.active.streetNum == '' ||
      this.active.postalNum == '' ||
      this.active.place == ''
    ) {
      this.setState({ showError: true });
    } else {
      this.setState({ showError: false });
      this.setState({ showConfirm: true });
    }
  }

  render() {
    if (!this.state.customer) return null;

    if (this.state.change) {
      return (
        <div>
          <NavBar brand="CycleOn Rentals">
            <h1>Kundeliste</h1>
          </NavBar>
          <Card>
            <h5>Endre Kunde:</h5>
            <br />
            <form onSubmit={this.handleShow}>
              <Form.Label>Kunde id:</Form.Label>
              <Form.Input type="text"  value={this.state.customer.id} disabled />
              <Form.Label>Fornavn:</Form.Label>
              <Form.Input
                required  
                type="text"
                value={this.active.firstName}
                onChange={event => (this.active.firstName = event.target.value)}
              />
              <Form.Label>Etternavn:</Form.Label>
              <Form.Input
                required
                type="text"
                value={this.active.lastName}
                onChange={event => (this.active.lastName = event.target.value)}
              />
              <Form.Label>Epost:</Form.Label>
              <Form.Input
                required
                type="email"
                value={this.active.email}
                onChange={event => (this.active.email = event.target.value)}
              />
              <Form.Label>Telefon:</Form.Label>
              <Form.Input
                required
                type="number"
                value={this.active.tlf}
                onChange={event => (this.active.tlf = event.target.value)}
              />
              <Form.Label>Adresse:</Form.Label>
              <Form.Input
                required
                type="text"
                value={this.active.streetAddress}
                onChange={event => (this.active.streetAddress = event.target.value)}
              />
              <Form.Label>Gatenummer:</Form.Label>
              <Form.Input
                required
                type="text"
                value={this.active.streetNum}
                onChange={event => (this.active.streetNum = event.target.value)}
              />
              <Form.Label>Postnummer:</Form.Label>
              <Form.Input
                required
                type="number"
                value={this.active.postalNum}
                onChange={event => (this.active.postalNum = event.target.value)}
              />
              <Form.Label>Post Sted:</Form.Label>
              <Form.Input
                type="text"
                value={this.active.place}
                onChange={event => (this.active.place = event.target.value)}
              />
              <br />
              <Row>
                <Column>
                  <ButtonOutline.Submit>Lagre</ButtonOutline.Submit>
                </Column>
                <Column right>
                  <ButtonOutline.Secondary onClick={this.cancel}>Cancel</ButtonOutline.Secondary>
                </Column>
              </Row>
            </form>
          </Card>

          <Modal show={this.state.showConfirm} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Er informasjonen riktig?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Er du sikker på at du vil gjøre disse endringene?</p>
              <br />
              <p>Trykk Utfør for å godta endringene</p>
            </Modal.Body>
            <Modal.Footer>
              <Row>
                <Column>
                  <ButtonOutline.Success onClick={this.save}>Utfør</ButtonOutline.Success>
                </Column>
                <Column right>
                  <ButtonOutline.Secondary onClick={this.handleClose}>Avbryt</ButtonOutline.Secondary>
                </Column>
              </Row>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.showError} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Noe gikk galt</Modal.Title>
            </Modal.Header>
            <Modal.Body>Sjekk at alle felt er utfylt korrekt, og prøv igjen.</Modal.Body>
            <Modal.Footer>
              <ButtonOutline.Secondary onClick={this.handleClose}>Avbryt</ButtonOutline.Secondary>
            </Modal.Footer>
          </Modal>
        </div>
      );
    } else if (this.state.allOrders) {
      return (
        <Card>
          <h5>Tidligere ordre</h5>
          <br />
          <Row>
            <Column>
              <Table>
                <Table.Thead>
                  <Table.Th>Ordre-ID</Table.Th>
                  <Table.Th>Ordretype</Table.Th>
                  <Table.Th>Bestillingsdato</Table.Th>
                  <Table.Th>Start for utleie</Table.Th>
                  <Table.Th>Slutt for utleie</Table.Th>
                  <Table.Th>Pris</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.ordersByCustomer.map(orders => (
                    <Table.Tr key={orders.id}>
                      <Table.Td>{orders.id}</Table.Td>
                      <Table.Td>{orders.typeName}</Table.Td>
                      <Table.Td>{orders.dateOrdered.toString().substring(4, 24)}</Table.Td>
                      <Table.Td>{orders.fromDateTime.toString().substring(4, 24)}</Table.Td>
                      <Table.Td>{orders.toDateTime.toString().substring(4, 24)}</Table.Td>
                      <Table.Td>{orders.price} kr</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>
          </Row>
          <br />
          <ButtonOutline.Secondary type="button" onClick={this.cancel}>
            Gå tilbake
          </ButtonOutline.Secondary>
        </Card>
      );
    } else {
      return (
        <Card>
          <h5>Valgt Kunde:</h5>
          <br />
          <h6>
            {this.state.customer.firstName} {this.state.customer.lastName}
          </h6>
          <Table>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Kunde id:</Table.Td>
                <Table.Td>{this.state.customer.id}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Fornavn:</Table.Td>
                <Table.Td>{this.state.customer.firstName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Etternavn:</Table.Td>
                <Table.Td>{this.state.customer.lastName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Epost:</Table.Td>
                <Table.Td>{this.state.customer.email}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Telefon:</Table.Td>
                <Table.Td>{this.state.customer.tlf}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Adresse:</Table.Td>
                <Table.Td>
                  {this.state.customer.streetAddress} {this.state.customer.streetNum}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Poststed:</Table.Td>
                <Table.Td>
                  {this.state.customer.postalNum} {this.state.customer.place}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <br />
          <Row>
            <Column width={2}>
              <ButtonOutline.Success onClick={this.change}>Endre</ButtonOutline.Success>
            </Column>
            <Column>
              <ButtonOutline.Info onClick={this.allOrders}>Se tidligere ordre</ButtonOutline.Info>
            </Column>
          </Row>
        </Card>
      );
    }
  }

  change() {
    this.setState({ change: true });
  }

  allOrders() {
    this.setState({ allOrders: true });

    customerService.getCustomerOrders(this.state.customer.id, ordersByCustomer => {
      this.ordersByCustomer = ordersByCustomer;
    });
  }

  cancel() {
    this.setState({ change: false, allOrders: false });
  }

  mounted() {
    customerService.getCustomer('1', result => {
      this.setState({ state: (this.state.customer = result) });
      this.active = result;
    });
  }

  save() {
    //Check if address already in database
    customerService.getAddressID(
      this.active.postalNum,
      this.active.place,
      this.active.streetAddress,
      this.active.streetNum,
      result => {
        // console.log(result);
        if (result === undefined) {
          customerService.addAddress(
            this.active.postalNum,
            this.active.place,
            this.active.streetAddress,
            this.active.streetNum
          );

          customerService.getAddressID(
            this.active.postalNum,
            this.active.place,
            this.active.streetAddress,
            this.active.streetNum,
            newID => {
              customerService.updateCustomer(
                this.active.firstName,
                this.active.lastName,
                this.active.email,
                this.active.tlf,
                newID.id,
                this.state.customer.id
              );
            }
          );
        } else {
          customerService.updateCustomer(
            this.active.firstName,
            this.active.lastName,
            this.active.email,
            this.active.tlf,
            result.id,
            this.state.customer.id
          );
        }
      }
    );

    this.setState({ change: false });
  }
}

class AddCustomer extends Component {
  firstName = '';
  lastName = '';
  email = '';
  tlf = 0;
  street = 0;
  streetNum = 0;
  postal = 0;
  place = '';
  addressID = null;

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Kundeliste</h1>
        </NavBar>
        <Card>
          <div className="container">
            <h5>Ny kunde</h5>
            <br />
            <form onSubmit={e => {
                    if (window.confirm('Er du sikker på at informasjonen er korrekt?')) this.add(e);
                  }}>
            <Row>
              <Column width={5}>
                <Form.Label>Fornavn:</Form.Label>
                <Form.Input type="text" required={true} onChange={event => (this.firstName = event.target.value)} />
              </Column>
              <Column width={5}>
                <Form.Label>Etternavn:</Form.Label>
                <Form.Input type="text" required={true} onChange={event => (this.lastName = event.target.value)} />
              </Column>
            </Row>
            <Row>
              <Column width={5}>
                <Form.Label>Email:</Form.Label>
                <Form.Input type="email" required={true} id="emailField" onChange={event => (this.email = event.target.value)} />
              </Column>
              <Column width={5}>
                <Form.Label>Telefon:</Form.Label>
                <Form.Input type="number" required={true} min='8' onChange={event => (this.tlf = event.target.value)} />
              </Column>
            </Row>
            <Row>
              <Column width={8}>
                <Form.Label>Gateaddresse:</Form.Label>
                <Form.Input type="text" required={true} onChange={event => (this.street = event.target.value)} />
              </Column>
              <Column width={2}>
                <Form.Label>Gatenummer:</Form.Label>
                <Form.Input type="text" required={true} onChange={event => (this.streetNum = event.target.value)} />
              </Column>
            </Row>
            <Row>
              <Column width={5}>
                <Form.Label>Postnummer:</Form.Label>
                <Form.Input type="number" required={true} onChange={event => (this.postalNum = event.target.value)} />
              </Column>
              <Column width={5}>
                <Form.Label>Poststed:</Form.Label>
                <Form.Input type="text" required={true} onChange={event => (this.postal = event.target.value)} />
              </Column>
            </Row>
            <br />
            <Row>
              <Column>
                <ButtonOutline.Submit
                  type='submit'
                >
                  Legg til
                </ButtonOutline.Submit>
              </Column>
              <Column right>
                <ButtonOutline.Secondary onClick={this.cancel}>Cancel</ButtonOutline.Secondary>
              </Column>
            </Row>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  cancel() {
    this.props.history.goBack();
  }

  add() {
    //Check if address already in database
    customerService.getAddressID(this.postalNum, this.postal, this.street, this.streetNum, result => {
      // console.log(result);
      if (result === undefined) {
        customerService.addAddress(this.postalNum, this.postal, this.street, this.streetNum);

        customerService.getAddressID(this.postalNum, this.postal, this.street, this.streetNum, newID => {
          customerService.addCustomer(this.firstName, this.lastName, this.email, this.tlf, newID.id);
        });
      } else {
        customerService.addCustomer(this.firstName, this.lastName, this.email, this.tlf, result.id);
      }
    });

    history.push('/customers/');
  }
}

module.exports = { Customers, AddCustomer };
