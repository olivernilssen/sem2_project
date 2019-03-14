import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import { connection } from './mysql_connection';
import { basket, employeeID } from './index.js';

import createHashHistory from 'history/createHashHistory';
import { start } from 'repl';
const history = createHashHistory(); // Use history.push(...) to programmatically change path


class UserInfo extends Component {
  fornavn = '';
  etternavn = '';
  email = '';
  tlf = '';
  gate = '';
  poststed = '';
  postnummer = '';
  nr = '';

  render() {
    return (
      <div>
        <Card title="Brukerinformasjon">
          <Row>
            <Column width={5}>
              <b>Fornavn:</b> {this.fornavn}
            </Column>



            <Column width={5}>
              <b>Etternavn:</b> {this.etternavn}
            </Column>
          </Row>

          <Row>
            <Column width={5}>
             <b>Epost:</b> {this.email}
            </Column>

            <Column width={5}>
              <b>Telefonnummer:</b> {this.tlf}
            </Column>
          </Row>

          <Row>
            <Column width={10}>
              <b>Gateadresse:</b> {this.gate} {this.nr}
            </Column>
          </Row>

          <Row>
            <Column width={5}>
              <b>Poststed:</b> {this.poststed}
            </Column>

            <Column width={5}>
              <b>Postnummer:</b> {this.postnummer}
            </Column>
          </Row>

          <br />
          <Button.Success type="button" onClick={ () => history.push("/EditUserInfo")}>
            Endre informasjon
          </Button.Success>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getAnsatt(employeeID, ansatt => {
      this.fornavn = ansatt.firstName;
      this.etternavn = ansatt.lastName;
      this.email = ansatt.email;
      this.tlf = ansatt.tlf;

      this.nr = ansatt.streetNum;
      this.gate = ansatt.streetAddress;
      this.poststed = ansatt.place;
      this.postnummer = ansatt.postalNum;
    });
  }


}


class EditUserInfo extends Component {
  fornavn = '';
  etternavn = '';
  email = '';
  tlf = '';
  gate = '';
  poststed = '';
  postnummer = '';
  nr = '';

  render() {
    return (
      <div>
        <Card title="Brukerinformasjon">
          <Row>
            <Column width={5}>
              <Form.Label>Fornavn:</Form.Label>
              <Form.Input type="text" value={this.fornavn} onChange={event => (this.fornavn = event.target.value)} />
            </Column>



            <Column width={5}>
              <Form.Label>Etternavn:</Form.Label>
              <Form.Input
                type="text"
                value={this.etternavn}
                onChange={event => (this.etternavn = event.target.value)}
              />
            </Column>
          </Row>

          <Row>
            <Column width={5}>
              <Form.Label>Epost:</Form.Label>
              <Form.Input type="text" value={this.email} onChange={event => (this.email = event.target.value)} />
            </Column>

            <Column width={5}>
              <Form.Label>Telefonnummer:</Form.Label>
              <Form.Input type="text" value={this.tlf} onChange={event => (this.tlf = event.target.value)} />
            </Column>
          </Row>

          <Row>
            <Column width={8}>
              <Form.Label>Gateadresse:</Form.Label>
              <Form.Input type="text" value={this.gate} onChange={event => (this.gate = event.target.value)} />
            </Column>

            <Column width={2}>
              <Form.Label>Nummer:</Form.Label>
              <Form.Input type="text" value={this.nr} onChange={event => (this.nr = event.target.value)} />
            </Column>
          </Row>

          <Row>
            <Column width={5}>
              <Form.Label>Poststed:</Form.Label>
              <Form.Input type="text" value={this.poststed} onChange={event => (this.poststed = event.target.value)} />
            </Column>

            <Column width={5}>
              <Form.Label>Postnummer:</Form.Label>
              <Form.Input
                type="text"
                value={this.postnummer}
                onChange={event => (this.postnummer = event.target.value)}
              />
            </Column>
          </Row>

          <br />
          <Button.Success type="button" onClick={this.save}>
            Oppdatere informasjon
          </Button.Success>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Button.Danger type="button" onClick={ () => history.push("/information")}>
            Gå tilbake
          </Button.Danger>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getAnsatt(employeeID, ansatt => {
      this.fornavn = ansatt.firstName;
      this.etternavn = ansatt.lastName;
      this.email = ansatt.email;
      this.tlf = ansatt.tlf;

      this.nr = ansatt.streetNum;
      this.gate = ansatt.streetAddress;
      this.poststed = ansatt.place;
      this.postnummer = ansatt.postalNum;
    });
  }

  save() {
    rentalService.updateAnsatt(
      employeeID,
      this.fornavn,
      this.etternavn,
      this.email,
      this.tlf,
      this.gate,
      this.poststed,
      this.postnummer,
      this.nr,
      () => {
        history.push('/information');
      }
    );
  }
}

class MineSalg extends Component {

  sales = [];


  render() {
    return (
      <div>
        <Card title="Mine salg">

        Dette er en liste over salg du har gjort.
        Hvis du ikke har solgt mye håper vi du har dårlig samvittighet.
        <br /><br />

              <Row>
                <Column>
                  <Table>
                    <Table.Thead>
                    <Table.Th>ID</Table.Th>
                      <Table.Th>Kunde</Table.Th>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Bestillingsdato</Table.Th>
                      <Table.Th>Start for utleie</Table.Th>
                      <Table.Th>Slutt for utleie</Table.Th>
                      <Table.Th>Pris</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Thead>
                    <Table.Tbody>

                        {this.sales.map(sale => (
                          <Table.Tr key ={sale.id}>
                          <Table.Td>{sale.id}</Table.Td>
                          <Table.Td>{sale.firstName} {sale.lastName}</Table.Td>
                          <Table.Td>{sale.typeName}</Table.Td>
                          <Table.Td>{sale.dateOrdered.toString().substring(4, 24)}</Table.Td>
                          <Table.Td>{sale.fromDateTime.toString().substring(4, 24)}</Table.Td>
                          <Table.Td>{sale.toDateTime.toString().substring(4, 24)}</Table.Td>
                          <Table.Td>{sale.price} kr</Table.Td>
                          <Table.Td><Button.Success type="button"  onClick={ () => history.push("/MineSalg/" + sale.id + "/edit")} >Se bestilling</Button.Success></Table.Td>
                        </Table.Tr>))}

                    </Table.Tbody>
                  </Table>
                </Column>
              </Row>
            </Card>
          </div>
    );
  }

  mounted() {
    rentalService.getSales(employeeID, sales => {
      this.sales = sales;
    });
  }


}

class Bestilling extends Component {


  render() {
    return (
      <div>
      <Card title = "Se på bestilling">

      Under ser du innholdet til bestilling nr. {this.props.match.params.id}. <br /> <br />

      <Row>
        <Column>
          <Table>
            <Table.Thead>
            <Table.Th>ID</Table.Th>
              <Table.Th>Kunde</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Bestillingsdato</Table.Th>
              <Table.Th>Start for utleie</Table.Th>
              <Table.Th>Slutt for utleie</Table.Th>
              <Table.Th>Pris</Table.Th>
              <Table.Th></Table.Th>
            </Table.Thead>
            <Table.Tbody>


                  <Table.Tr>
                  <Table.Td></Table.Td>
                </Table.Tr>

            </Table.Tbody>
          </Table>
        </Column>
      </Row>

      </Card>
          </div>
    );
  }

  mounted() {


  }


}



module.exports = {
  UserInfo,
  EditUserInfo,
  MineSalg,
  Bestilling
};
