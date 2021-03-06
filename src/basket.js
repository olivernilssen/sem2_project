import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Row, Column, NavBar, Button, ButtonOutline, Form, Table, H1, Select, CenterContent } from './widgets';
import { NavLink } from 'react-router-dom';
import { customerService } from './services/customersService';
import { orderService } from './services/ordersService';
import { basket, shared, activeCustomer, equipmentBasket, employeeID } from './index.js';
import { Modal } from 'react-bootstrap';
require('react-bootstrap/ModalHeader');
require('react-bootstrap/Modal');

import createHashHistory from 'history/createHashHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { equipmentService } from './services/equipmentService.js';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class Basket extends Component {
  totalPrice = 0;
  discPrice = 0;
  discount = 0;
  state = {
    showConfirm: false,
    showError: false,
    inBasket: basket,
    kunder: [],
    phrase: '',
    activeC: activeCustomer,
    displayCustomer: 'block'
  };
  styleState = {
    display: 'block',
    clear: 'both'
  };

  /**Handle close
   * Close any of the two modals
   */
  handleClose() {
    this.setState({ showError: false });
    this.setState({ showConfirm: false });
  }

  /**Handle Show
   * Shows one out of two modals. Either the error Modal
   * or the Confirm your purchase Modal, depending
   * if we have the correct information
   */
  handleShow() {
    if (this.state.activeC[0].id == null || this.state.inBasket == null || this.state.inBasket.length == 0) {
      this.setState({ showError: true });
    } else {
      this.setState({ showError: false });
      this.setState({ showConfirm: true });
    }
  }

  /**Bike Remove
   * Removes the clicked bike from our list and basket.
   * Also removes from global list, so that it can be found again in booking
   * @bike - item that we click eg. a bike in our list
   */
  removeBike(bike) {
    //Removes bike from basket
    for (let i of basket) {
      if (bike == i) {
        this.totalPrice -= basket[basket.indexOf(i)].displayPrice;
        basket.splice(basket.indexOf(i), 1);
        shared.basketLength = basket.length;
        this.updateBasket();
        this.calcDiscount();
      }
    }

    //Removes all equipment belong to bike with it
    for (var i = 0; equipmentBasket.length > i; i++) {
      if (equipmentBasket[i].bike_id == bike.id) {
        equipmentBasket.splice(i, 1);
        this.totalPrice -= equipmentBasket[i].displayPrice;
        i--;
      }
    }
  }

  /**Update Basket
   * Updates the basket, whenever an item has been removed
   * checks that local list is equal to global list
   * and removed the ones that aren't available anymore.
   */
  updateBasket() {
    this.state.inBasket = [];

    if (basket.length == 0) this.styleState.display = 'none';
    else this.styleState.display = 'block';

    this.setState(state => {
      const inBasket = state.inBasket.concat(basket);
      return { inBasket, basket };
    });
  }

  /**Handle change phrase
   * This checks to see if there has been a change in the input
   * for the search menu. If there is, change the value shown and
   * search the database using findcustomers();
   * @event - event that happens (eg. keypress)
   */
  handleChangePhrase(event) {
    this.setState({ phrase: event.target.value }, this.findCustomers());
  }

  /**Find all customers
   * Does a query for all customers that is in the database
   * Allows the user to search throught the database by using
   * the search field at the top.
   * Will call this function as the user types.
   */
  findCustomers() {
    let queryPhrase = '';

    if (this.state.phrase == ' ') queryPhrase = '%';
    else queryPhrase = '%' + this.state.phrase + '%';

    customerService.getCustomerSearch(queryPhrase, results => {
      this.state.kunder = [];

      if (results.length == 0) {
        this.setState(state => {
          const kunder = state.kunder.concat({ firstName: 'Søk igjen' });
          return { kunder };
        });
      } else {
        this.setState(state => {
          const kunder = state.kunder.concat(results);
          return { kunder, results };
        });
      }
    });
  }

  /**Choose Remove
   * Chooses the selected customer
   * And then removes the list of customers from
   * the users view, and adds a name at the top of the screen that
   * says which customer that is chosen.
   * @customer - clicked item from table (eg. customer)
   */
  chooseCustomer(customer) {
    this.state.displayCustomer = 'none';
    activeCustomer.splice(0, 1);
    activeCustomer.push(customer);
    this.setState({ state: (this.state.activeC[0] = customer) });
  }

  /**Remove Customer
   * Function to remove current selected customer
   * Sets current selected active ID to null, so that program can stil render
   * as it looks for customer ID otherwise.
   * Also shows the list of customers again.
   */
  removeCustomer() {
    this.state.displayCustomer = 'block';
    this.setState({ state: (this.state.activeC[0] = [{ id: null }]) });
    this.setState({ state: (this.state.phrase = '') });
    this.findCustomers();
  }

  /**Basket Remove
   * This is to remove equipment from our global and local equipment basket
   * By checking the clicked item against basked and splicing it.
   * @equipment - item that we click eg. an equipment in our list
   */
  basketRemove(equipment) {
    for (var i = 0; equipmentBasket.length > i; i++) {
      if (equipmentBasket[i].id == equipment.id) {
        equipmentBasket.splice(i, 1);
      }
    }

    this.findCustomers();
  }

  /**Calculate Discount
   * This function is to give our price a discount if there
   * is one to be given. If dicount = 0, then the discPrice is
   * equal to the totalPrice.
   */
  calcDiscount() {
    if (this.discount != 0 || this.discount != null) {
      this.discPrice = (1 - this.discount / 100) * this.totalPrice;
    }
  }

  /**Rendered
   * We render whats in the baskets for bikes AND equipments
   * We add buttons and return statements
   */
  render() {
    if (this.state.activeC[0].id == null) this.state.displayCustomer = 'block';
    else this.state.displayCustomer = 'none';

    const styles = {
      btnStyle: { display: this.styleState.display },
      divStyle: { display: this.state.displayCustomer }
    };

    const { divStyle } = styles;
    const { btnStyle } = styles;
    let notice;

    //If the equipment basket is empty, show a text that says
    //it is empty
    if (equipmentBasket.length == 0) {
      notice = (
        <Table.Tr>
          <Table.Td>Handlekurven din er tom for utstyr.</Table.Td>
        </Table.Tr>
      );
    }

    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Handlekurv</h1>
        </NavBar>

        <Card role="main">
          <Row>
            <Column>
              <Form.Label>
                <h4>
                  Valgt kunde: {this.state.activeC[0].id} {this.state.activeC[0].firstName}{' '}
                  {this.state.activeC[0].lastName}
                </h4>
              </Form.Label>
              <br />
              <ButtonOutline.Danger
                onClick={() => {
                  this.removeCustomer();
                }}
              >
                Fjern Kunde
              </ButtonOutline.Danger>
              <br />
              <br />
              <h6>Handlekurv for sykler:</h6>
              <Column>
                <Table>
                  <Table.Thead>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Merke</Table.Th>
                    <Table.Th>Lokasjon</Table.Th>
                    <Table.Th>Fra Dato</Table.Th>
                    <Table.Th>Til Dato</Table.Th>
                    <Table.Th>Pris</Table.Th>
                    <Table.Th>Timesleie</Table.Th>
                    <Table.Th />
                    <Table.Th />
                  </Table.Thead>
                  <Table.Tbody>
                    {this.state.inBasket.map(bike => (
                      <Table.Tr key={bike.id}>
                        <Table.Td>{bike.id}</Table.Td>
                        <Table.Td>{bike.typeName}</Table.Td>
                        <Table.Td>{bike.brand}</Table.Td>
                        <Table.Td>{bike.name}</Table.Td>
                        <Table.Td>{bike.startDateString}</Table.Td>
                        <Table.Td>{bike.endDateString}</Table.Td>
                        <Table.Td>{bike.displayPrice}</Table.Td>
                        <Table.Td>{bike.dayRent ? 'Ja' : 'Nei'}</Table.Td>
                        <Table.Td>
                          <ButtonOutline.Success
                            style={btnStyle}
                            onClick={() => history.push('/equipmentQuery/' + bike.id + '/edit')}
                          >
                            Velg utstyr
                          </ButtonOutline.Success>
                        </Table.Td>
                        <Table.Td>
                          <ButtonOutline.Danger
                            style={btnStyle}
                            onClick={() => {
                              this.removeBike(bike);
                            }}
                          >
                            Slett
                          </ButtonOutline.Danger>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Column>
              <br />
              <br />

              <h6>Handlekurv for utstyr:</h6>
              <Column>
                <Table>
                  <Table.Thead>
                    <Table.Th>Tilhører</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Merke</Table.Th>
                    <Table.Th>Størrelse</Table.Th>
                    <Table.Th>Pris</Table.Th>
                    <Table.Th />
                  </Table.Thead>
                  <Table.Tbody>
                    {notice}
                    {equipmentBasket.map(equip => (
                      <Table.Tr key={equip.id}>
                        <Table.Td>{equip.bike_id}</Table.Td>
                        <Table.Td>{equip.typeName}</Table.Td>
                        <Table.Td>{equip.brand}</Table.Td>
                        <Table.Td>{equip.comment}</Table.Td>
                        <Table.Td>{equip.price}</Table.Td>
                        <Table.Td>
                          <ButtonOutline.Danger onClick={() => this.basketRemove(equip)}>Slett</ButtonOutline.Danger>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Column>
              <br />
              <Row>
                <Column right>
                  <Column>
                    <ButtonOutline.Info onClick={this.calcDiscount} style={{ float: 'right' }}>
                      <FontAwesomeIcon className="" icon="percent" />
                    </ButtonOutline.Info>
                    <Form.Input
                      type="number"
                      placeholder={'Rabatt'}
                      onChange={event => (this.discount = event.target.value)}
                      style={{ width: 100, float: 'right', border: '1 solid #F7F7F7' }}
                    />
                  </Column>
                </Column>
              </Row>
              <br />
              <Row>
                <Column right>
                  <Column>
                    <h4>Totalpris: {this.discPrice}</h4>
                  </Column>
                  <Column>
                    <Button.Info onClick={this.handleShow}>
                      <FontAwesomeIcon className="navIcon" icon="store" />
                      Til Betaling
                    </Button.Info>
                  </Column>
                </Column>
              </Row>
            </Column>

            <Column style={divStyle} width={4}>
              <Card>
                <Column right>
                  <NavLink to={'/addCustomer/'}>
                    <ButtonOutline.Success>Legg til ny kunde</ButtonOutline.Success>
                  </NavLink>
                </Column>
                <Form.Label>Søk i kunder..</Form.Label>
                <Form.Input value={this.state.phrase} onChange={this.handleChangePhrase} />
                <br />
                <Table>
                  <Table.Thead>
                    <Table.Th>Fornavn</Table.Th>
                    <Table.Th>Etternavn</Table.Th>
                    <Table.Th />
                  </Table.Thead>
                  <Table.Tbody>
                    {this.state.kunder.map(kunde => (
                      <Table.Tr key={kunde.id}>
                        <Table.Td>{kunde.firstName}</Table.Td>
                        <Table.Td>{kunde.lastName}</Table.Td>
                        <Table.Td>
                          <ButtonOutline.Info
                            onClick={() => {
                              this.chooseCustomer(kunde);
                            }}
                          >
                            <FontAwesomeIcon className="" icon="plus" />
                          </ButtonOutline.Info>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Column>
          </Row>
        </Card>

        <Modal show={this.state.showConfirm} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Er informasjonen riktig?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <b>Kunde: </b>
              {this.state.activeC[0].firstName} {this.state.activeC[0].lastName}
            </p>

            <p>
              <b>Antall sykler: </b>
              {this.state.inBasket.length}
            </p>

            <p>
              <b>Antall utstyr: </b>
              {equipmentBasket.length}
            </p>

            <p>
              <b>Pris:</b> {this.discPrice}{' '}
            </p>
            <p>
              <b>Ansatt med ID: </b>
              {employeeID}
            </p>
            <br />
            <p>Trykk Utfør for å legge inn bestilling</p>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Column>
                <ButtonOutline.Success onClick={this.transaction}>Utfør</ButtonOutline.Success>
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
          <Modal.Body>
            Sjekk at all informasjonen er riktig og at du har lagt til kunde og elementer i handlekurven.
          </Modal.Body>
          <Modal.Footer>
            <ButtonOutline.Secondary onClick={this.handleClose}>Avbryt</ButtonOutline.Secondary>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  /** Mounted
   * We first update price
   * Then we put all our items from global list basket into our
   * local array. As well as getting the global customer and
   * gives our local variabel for customer a value.
   */
  mounted() {
    if (this.state.inBasket == null || this.state.inBasket.length == 0) {
    } else {
      for (let i = 0; i < this.state.inBasket.length; i++) {
        if (this.state.inBasket[i].dayRent == false) {

          //calculate the amount of days the bikes are rented for
          let timeDiff = Math.abs(this.state.inBasket[i].endDate - this.state.inBasket[i].startDate);
          let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

          //if the days are less than 1 day, then calculate the hour rate
          if (timeDiff > 1) {
            this.state.inBasket[i].displayPrice =
              this.state.inBasket[i].price + this.state.inBasket[i].price * 0.5 * diffDays;
          }
          this.totalPrice += this.state.inBasket[i].displayPrice;

        } else {
          let timeDiff = Math.abs(this.state.inBasket[i].endDate - this.state.inBasket[i].startDate);
          let diffHours = Math.ceil(timeDiff / (1000 * 3600));
          this.state.inBasket[i].displayPrice = (this.state.inBasket[i].price / 4) * diffHours;
          this.totalPrice += this.state.inBasket[i].displayPrice;

        }
      }
    }

    //if the equipmentbasket is not empty, then
    //add the price to the total price
    if (equipmentBasket != 0) {
      for (let i = 0; i < equipmentBasket.length; i++) {
        this.totalPrice += equipmentBasket[i].price;
      }
    }

    //Show the discounted price as the totalprice
    this.discPrice = this.totalPrice;

    customerService.getCustomerSearch('%', results => {
      this.setState(state => {
        const kunder = state.kunder.concat(results);
        return {
          kunder,
          results
        };
      });
    });
  }

  /**
   * Transation
   * This class is to add items from basket into an order
   * in the database. It has to get todays date for when the order was made.
   * @Basket
   */
  transaction() {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let time = today.getHours();
    let minutes = today.getMinutes();
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    let orderType = 1;

    let todaysDate = year + '-' + month + '-' + day + ' ' + time + ':' + minutes + ':00';

    if (this.state.inBasket[0].dayRent == true) {
      orderType = 2;
    }

    orderService.makeOrder(
      this.state.activeC[0].id,
      orderType,
      todaysDate,
      this.state.inBasket[0].startDate,
      this.state.inBasket[0].endDate,
      this.discPrice,
      employeeID
    );

    for (let i = 0; i < this.state.inBasket.length; i++) {
      orderService.makeBikeOrder(this.state.activeC[0].id, todaysDate, this.state.inBasket[i].id);
    }

    if (equipmentBasket.length > 0) {
      for (let i = 0; i < equipmentBasket.length; i++) {
        orderService.makeEquipOrder(this.state.activeC[0].id, todaysDate, equipmentBasket[i].id);
      }
    }

    basket.length = 0;
    equipmentBasket.length = 0;
    this.totalPrice = 0;
    this.discPrice = 0;
    this.removeCustomer();
    this.updateBasket();
    this.handleClose();
    history.push('/overview/');
  }
}

class EquipmentQuery extends Component {
  suitableEquipment = [];
  equipmentTypes = [];
  choiceLock = false;
  secondChoiceLock = false;
  sizes = [];
  location = '';

  state = {
    selectStatus: '%',
    sizeSelectStatus: '%',
    inEqBasket: equipmentBasket
  };


  /** handle change
   * set the state of whichever target.name equals, to
   * the new target value
   * then call the specify function.
   */
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, this.specify());
  }

  /** basket Add
   * Adds an equipment to the seperate
   * basket for equipments.
   * @equipment - element that is clicked in available equipment
   */
  basketAdd(equipment) {
    equipmentBasket.push(equipment);
    this.specify();
  }

  /** basket remove
   * Iterates throught the list of equipments
   * if any of them is equal to the clicked element
   * it will be removed from the basket.
   * @equipment - element that is clicked in the equipment basket
   */
  basketRemove(equipment) {
    for (var i = 0; equipmentBasket.length > i; i++) {
      if (equipmentBasket[i].id == equipment.id) {
        equipmentBasket.splice(i, 1);
      }
    }

    this.specify();
  }

  render() {
    if (!this.sizes) return null;
    let notice;

    if (equipmentBasket.length == 0) {
      notice = (
        <Table.Tr>
          <Table.Td>Ingen valgte utstyr</Table.Td>
        </Table.Tr>
      );
    }

    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Handlekurv</h1>
        </NavBar>
        <br />
        <Row>
          <Column>
            <Button.Light onClick={() => history.push('/basket/')}>Tilbake til handlekurv</Button.Light>
          </Column>
        </Row>
        <Card>
          <Row>
            <Column width={4}>
              <Form.Label>Utstyrstype:</Form.Label>
              <Select name={'selectStatus'} onChange={this.handleChange}>
                <Select.Option value="%">Velg en utstyrstype ...</Select.Option>
                {this.equipmentTypes.map(type => (
                  <Select.Option key={type.id} value={type.toString()}>
                    {type.toString()}
                  </Select.Option>
                ))}
              </Select>
            </Column>

            <Column width={4}>
              <Form.Label>Størrelse:</Form.Label>
              <Select name={'sizeSelectStatus'} onChange={this.handleChange}>
                <Select.Option key={'x'} value="%">
                  Velg en størrelse ...
                </Select.Option>
                {this.sizes.map(type => (
                  <Select.Option key={type.id} value={type.toString()}>
                    {type.toString()}
                  </Select.Option>
                ))}
              </Select>
            </Column>
          </Row>
          <br />
          <Row>
            <Column>
              <h6>Tilgjengelig utstyr:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>År</Table.Th>
                  <Table.Th>Størrelse</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Pris</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.suitableEquipment.map(equip => (
                    <Table.Tr key={equip.id}>
                      <Table.Td>{equip.id}</Table.Td>
                      <Table.Td>{equip.typeName}</Table.Td>
                      <Table.Td>{equip.brand}</Table.Td>
                      <Table.Td>{equip.year}</Table.Td>
                      <Table.Td>{equip.comment}</Table.Td>
                      <Table.Td>{equip.objectStatus}</Table.Td>
                      <Table.Td>{equip.price}</Table.Td>
                      <Table.Td>
                        <ButtonOutline.Success onClick={() => this.basketAdd(equip)}>
                          <FontAwesomeIcon icon="plus" />
                        </ButtonOutline.Success>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>

            <Column>
              <h6>Valgt utstyr:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Størrelse</Table.Th>
                  <Table.Th>Pris</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {notice}
                  {this.state.inEqBasket.map(equip => (
                    <Table.Tr key={equip.id}>
                      <Table.Td>{equip.id}</Table.Td>
                      <Table.Td>{equip.typeName}</Table.Td>
                      <Table.Td>{equip.brand}</Table.Td>
                      <Table.Td>{equip.comment}</Table.Td>
                      <Table.Td>{equip.price}</Table.Td>
                      <Table.Td>
                        <Button.Danger onClick={() => this.basketRemove(equip)}>Slett</Button.Danger>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>
          </Row>
        </Card>
      </div>
    );
  }

  mounted() {
    equipmentService.getLocationFromBikeId(this.props.match.params.id, location => {
      this.location = location[0].id;
    });

    equipmentService.getTypeNameForSuitableEquipment(this.props.match.params.id, typeName => {
      equipmentService.getSuitableEquipment(
        this.location,
        this.state.selectStatus,
        this.state.sizeSelectStatus,
        typeName[0].typeName,
        equipment => {
          let k = this.props.match.params.id;
          equipment.forEach(function(e) {
            e.bike_id = k;
          });

          this.suitableEquipment = equipment;

          if (this.secondChoiceLock == false) {
            this.sizes = equipment;

            let flags = [],
              output = [],
              l = this.sizes.length,
              i;
            for (i = 0; i < l; i++) {
              if (flags[this.sizes[i].comment]) continue;
              flags[this.sizes[i].comment] = true;
              output.push(this.sizes[i].comment);
            }

            this.sizes = output;
            this.secondChoiceLock = true;
          }

          if (this.choiceLock == false) {
            this.equipmentTypes = equipment;

            var flags = [],
              output = [],
              l = this.equipmentTypes.length;
            for (let i = 0; i < l; i++) {
              if (flags[this.equipmentTypes[i].typeName]) continue;
              flags[this.equipmentTypes[i].typeName] = true;
              output.push(this.equipmentTypes[i].typeName);
            }

            this.equipmentTypes = output;
            this.choiceLock = true;
          }
        }
      );
    });
  }


/* Basically an inelegant, but functional way to
redo all the searches under certain circumstances */

  specify() {
    equipmentService.getTypeNameForSuitableEquipment(this.props.match.params.id, typeName => {
      equipmentService.getSuitableEquipment(
        this.location,
        this.state.selectStatus,
        this.state.sizeSelectStatus,
        typeName[0].typeName,
        equipment => {
          let m = this.props.match.params.id;
          equipment.forEach(function(e) {
            e.bike_id = m;
          });

          this.suitableEquipment = equipment;

          for (var i = 0; this.suitableEquipment.length > i; i++) {
            for (var k = 0; equipmentBasket.length > k; k++) {
              if (this.suitableEquipment[i].id == equipmentBasket[k].id) {
                this.suitableEquipment.splice(i, 1);
              }
            }
          }

          if (this.secondChoiceLock == false) {
            this.sizes = equipment;
            var flags = [],
              output = [],
              l = this.sizes.length,
              i;

            for (i = 0; i < l; i++) {
              if (flags[this.sizes[i].comment]) continue;
              flags[this.sizes[i].comment] = true;
              output.push(this.sizes[i].comment);
            }

            this.sizes = output;
            this.secondChoiceLock = true;
          }

          if (this.choiceLock == false) {
            this.equipmentTypes = equipment;
            var flags = [],
              output = [],
              l = this.equipmentTypes.length,
              i;

            for (i = 0; i < l; i++) {
              if (flags[this.equipmentTypes[i].typeName]) continue;
              flags[this.equipmentTypes[i].typeName] = true;
              output.push(this.equipmentTypes[i].typeName);
            }

            this.equipmentTypes = output;
            this.choiceLock = true;
          }
        }
      );
    });
  }
}

module.exports = { Basket, EquipmentQuery };
