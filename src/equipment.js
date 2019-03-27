import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, H1, Select } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import { equipmentService } from './services/equipmentService';
import { connection } from './services/mysql_connection';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class EquipmentTypes extends Component {
  equipTypes = [];

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <H1>Sykkelutstyr</H1>
        </NavBar>
        <Tab>
          {this.equipTypes.map(type => (
            <Tab.Item key={type.typeName} to={'/equipmentTypes/' + type.typeName}>
              {type.typeName}
            </Tab.Item>
          ))}
          <Column right>
            <NavLink to={'/equipments/add/'}>
              <Button.Light>Legg inn nytt utstyr</Button.Light>
            </NavLink>
          </Column>
        </Tab>
      </div>
    );
  }

  mounted() {
    equipmentService.getDistinctEquipType(types => {
      for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < types.length; j++) {
          if (i == j) {
            continue;
          } else if (types[i].typeName == types[j].typeName) {
            types.splice(j, 1);
          }
        }
      }
      this.equipTypes = types;
    });
  }
}

class EquipmentTypesOtherMain extends Component {
  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <H1>Sykkelutstyr</H1>
        </NavBar>
        <Card>
          <Row>
            <Column>
              Opprettelsen av begrensningen var vellykket. Du vil ikke lenger kunne leie de respektive leiegjenstandene
              i kombinasjon. <br />
              <br />
            </Column>
          </Row>
        </Card>
      </div>
    );
  }
}

class EquipmentTypesMain extends Component {
  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <H1>Sykkelutstyr</H1>
        </NavBar>
        <Card>
          <Row>
            <Column>
              Slettingen av begrensningen var vellykket. Den vil ikke lenger hindre de respektive leiegjenstandene fra å
              leies ut sammen.
              <br />
              <br />
            </Column>
          </Row>
        </Card>
      </div>
    );
  }
}

class EquipTypeDetails extends Component {
  handler = '';
  restrictions = [];
  equipType = null;
  distinctBikeType = null;
  lock = false;
  selectStatus = '';
  showingEquipment = 0;

  state = {
    equipments: [],
    typeIds: [],
    equipTypeDetails: []
  };

  showThisType(id) {
    if (this.showingEquipment === id && this.lock == true) {
      this.lock = false;
      this.state.equipments = [];

      for (let i = 0; i < this.state.typeIds.length; i++) {
        equipmentService.getEquipmentByTypeID(this.state.typeIds[i].id, results => {
          this.setState(state => {
            const equipments = state.equipments.concat(results);
            return { equipments, results };
          });
        });
      }

      this.showingEquipment = 0;
    } else {
      console.log('hva skjer her elseee?');
      this.lock = true;

      equipmentService.getEquipmentByTypeID(id, results => {
        this.showingEquipment = id;
        this.setState(state => {
          this.state.equipments = [];
          const equipments = state.equipments.concat(results);
          return { equipments, results };
        });
      });
    }
  }

  render() {
    if (!this.equipType) return null;
    if (!this.distinctBikeType) return null;

    let notice;

    if (this.lock == true) {
      notice = (
        <p style={{ color: 'red' }}>Trykk på samme leiegjenstand igjen for å se beholdning for alle størrelser/typer</p>
      );
    }

    let noRestr;

    if (this.restrictions.length == 0) {
      noRestr = <Table.Td>Det ble ikke funnet noen begrensninger.</Table.Td>;
    }

    return (
      <div>
        <Card>
          <Row>
            <Column width={12}>
              <h6>Velg en spesiell størrelse/type ved å trykke på den i tabellen:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Årsmodell</Table.Th>
                  <Table.Th>Størrelse</Table.Th>
                  <Table.Th>Pris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.state.equipTypeDetails.map(type => (
                    <Table.Tr
                      key={type.id}
                      onClick={() => {
                        this.showThisType(type.id);
                      }}
                    >
                      <Table.Td>{type.brand}</Table.Td>
                      <Table.Td>{type.year}</Table.Td>
                      <Table.Td>{type.comment}</Table.Td>
                      <Table.Td>{type.price}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>
          </Row>
          <Row>
            <Column right>{notice}</Column>
          </Row>
          <Row>
            <Column>
              <br />
              <h6>Beholdning for valgte varer:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.state.equipments.map(equip => (
                    <Table.Tr key={equip.id}>
                      <Table.Td>{equip.id}</Table.Td>
                      <Table.Td>{equip.name}</Table.Td>
                      <Table.Td>{equip.objectStatus}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <br />
            </Column>
          </Row>
          <Row>
            <Column width={4}>
              <h6>Sykkeltyper utstyret IKKE passer til:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>Navn</Table.Th>
                  <Table.Th>Endre</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>{noRestr}</Table.Tr>
                  {this.restrictions.map(restrictions => (
                    <Table.Tr key={restrictions.id}>
                      <Table.Td>{restrictions.typeName}</Table.Td>
                      <Table.Td>
                        <Button.Success onClick={() => this.delete(restrictions.id)}>Tillat</Button.Success>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <br />
            </Column>
            <Column width={1} />
            <Column>
              <h6>Velg ny sykkeltype å begrense for dette utstyret:</h6>
              <Select
                name="typeSelect"
                value={this.selectStatus}
                onChange={event => (this.selectStatus = event.target.value)}
              >
                <Select.Option value="">Du har ikke valgt noen sykkel..</Select.Option>
                {this.distinctBikeType.map(trestrictions => (
                  <Select.Option key={trestrictions.id}>{trestrictions.typeName} </Select.Option>
                ))}
              </Select>
              <br />
              <br />
              <Button.Danger
                style={{ float: 'right' }}
                onClick={() => {
                  this.add();
                }}
              >
                Legg til ny restriksjon
              </Button.Danger>
            </Column>
          </Row>
        </Card>
        <br />
      </div>
    );
  }

  add() {
    if (this.selectStatus != '') {
      equipmentService.getBikeIdByName(this.selectStatus, idResult => {
        equipmentService.addRestriction(
          JSON.stringify(idResult)
            .substring(6)
            .replace('}', ''),
          this.state.equipTypeDetails[0].id,
          () => {
            history.push('/equipmentTypes/Skip/OtherMain');
          }
        );
      });
    }
  }

  delete(id) {
    this.handler = id;

    equipmentService.deleteRestriction(this.handler, this.state.equipTypeDetails[0].id, () => {
      history.push('/equipmentTypes/Skip/Main');
    });
  }

  mounted() {
    equipmentService.getRestrictions(this.props.match.params.typeName, results => {
      this.restrictions = results;
      this.lock = false;
    });

    this.state.equipments = [];
    this.state.equipTypeDetails = [];

    equipmentService.getEquipmentTypes(type => {
      this.equipType = type;
    });

    equipmentService.getDistinctBikeType(this.props.match.params.typeName, distinctType => {
      this.distinctBikeType = distinctType;
    });

    equipmentService.getTypeID(this.props.match.params.typeName, idResult => {
      this.state.typeIds = idResult;

      for (let i = 0; i < idResult.length; i++) {
        equipmentService.getEquipmentByTypeID(idResult[i].id, results => {
          this.setState(state => {
            const equipments = state.equipments.concat(results);
            return { equipments, results };
          });
        });

        equipmentService.getEquipmentTypesWhere(idResult[i].id, typeResult => {
          this.setState(state => {
            const equipTypeDetails = state.equipTypeDetails.concat(typeResult);
            return {
              equipTypeDetails,
              typeResult
            };
          });
        });
      }
    });
  }
}

class AddEquipment extends Component {
  antall = 0;
  equipmentTypes = [];
  locations = [];
  state = {
    selectedEquipTypeID: 1,
    curLocation: ''
  };

  onChangeType(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({
      state: (this.state.selectedEquipTypeID = event.target.options[selectedIndex].getAttribute('data-key'))
    });
  }

  onChangeLocation(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({ state: (this.state.curLocation = event.target.options[selectedIndex].getAttribute('data-key')) });
  }

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <H1>Sykkelutstyr</H1>
        </NavBar>
        <Card>
          <div className="container">
            <h5>Legg inn nytt sykkelutstyr</h5>
            <br />
            <div className="container">
              <Row>
                <Column width={3}>
                  <Row>
                    <Form.Label>Utstyrstype:</Form.Label>
                  </Row>
                  <Row>
                    <Select onChange={this.onChangeType}>
                      {this.equipmentTypes.map(type => (
                        <Select.Option key={type.id} dataKey={type.id}>
                          {type.typeName} {type.brand} {type.year} {type.comment}
                        </Select.Option>
                      ))}
                    </Select>
                  </Row>
                </Column>
                <Column width={3}>
                  <Row>
                    <Form.Label>Lokasjon: </Form.Label>
                  </Row>
                  <Row>
                    <Select onChange={this.onChangeLocation}>
                      {this.locations.map(lokasjon => (
                        <Select.Option key={lokasjon.id} dataKey={lokasjon.id}>
                          {lokasjon.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Row>
                </Column>
              </Row>
              <br />
              <Row>
                <Column width={3}>
                  <Row>
                    <Form.Label>Antall:</Form.Label>
                  </Row>
                  <Row>
                    <Form.Input type="text" onChange={event => (this.antall = event.target.value)} />
                  </Row>
                </Column>
              </Row>
              <br />
              <Row>
                <Column>
                  <Button.Success onClick={this.add}>Add</Button.Success>
                </Column>
                <Column right>
                  <Button.Light onClick={this.cancel}>Cancel</Button.Light>
                </Column>
              </Row>
            </div>
          </div>
        </Card>
        <br />
        <div>
          <NewEquipmentType />
        </div>
        <br />
      </div>
    );
  }

  add() {
    if (this.antall <= 0) {
      return;
    } else {
      for (let i = 0; i < this.antall; i++) {
        equipmentService.addEquipment(this.state.curLocation, this.state.selectedEquipTypeID, 'OK');
      }
    }

    history.push('/equipmentTypes/Helmet');
  }

  cancel() {
    history.push('/equipmentTypes/Helmet');
  }

  mounted() {
    rentalService.getLocations(locations => {
      this.state.curLocation = locations[0].id;
      this.locations = locations;
    });

    equipmentService.getEquipmentTypes(type => {
      this.selectedEquipment = type[0].id;
      this.equipmentTypes = type;
    });
  }
}

class NewEquipmentType extends Component {
  typeName = '';
  brand = '';
  year = 0;
  comment = '';
  price = 0;

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <H1>Sykkelutstyr</H1>
        </NavBar>
        <Card>
          <div className="container">
            <h5>Ny utstyrstype</h5>
            <Row>
              <Column>
                <Form.Label>Type:</Form.Label>
                <Form.Input type="text" onChange={event => (this.typeName = event.target.value)} />
                <Form.Label>Merke:</Form.Label>
                <Form.Input type="text" onChange={event => (this.brand = event.target.value)} />
                <Form.Label>Årsmodell:</Form.Label>
                <Form.Input type="text" onChange={event => (this.year = event.target.value)} />
              </Column>
              <Column>
                <Form.Label>Størrelse:</Form.Label>
                <Form.Input type="text" onChange={event => (this.comment = event.target.value)} />
                <Form.Label>Pris:</Form.Label>
                <Form.Input type="text" onChange={event => (this.price = event.target.value)} />
                <br />
                <br />
              </Column>
            </Row>
            <br />
            <Row>
              <Column>
                <Button.Success onClick={this.add}>Add</Button.Success>
              </Column>
              <Column right>
                <Button.Light onClick={this.cancel}>Cancel</Button.Light>
              </Column>
            </Row>
          </div>
        </Card>
      </div>
    );
  }

  add() {
    equipmentService.newEquipmentType(this.typeName, this.brand, this.year, this.comment, this.price);

    history.push('/equipmentTypes/Helmet');
  }

  cancel() {
    history.push('/equipmentTypes/Helmet');
  }
}

module.exports = {
  EquipmentTypes,
  EquipTypeDetails,
  AddEquipment,
  EquipmentTypesMain,
  EquipmentTypesOtherMain
};
