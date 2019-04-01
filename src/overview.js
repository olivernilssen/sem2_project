import * as React from 'react';
import { Component } from 'react-simplified';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Card,
  Tab,
  List,
  Row,
  Column,
  NavBar,
  Button,
  ButtonOutline,
  Form,
  Table,
  H1,
  Select,
  CenterContent
} from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import { bikeService } from './services/bikesService';
import { orderService } from './services/OrdersService';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();
let day2 = day + 2;

if (day < 10) day = '0' + day;
if (day2 < 10) day2 = '0' + day2;
if (month < 10) month = '0' + month;

class Chart extends Component {
  months = [
    'Januar',
    'Februar',
    'Mars',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Desember'
  ];
  newData = null;
  newLabel = null;

  render() {
    const chartData = {
      labels: this.newLabel,
      datasets: [
        {
          data: this.newData,
          backgroundColor: [
            'rgba(255,99,132, 0.6)',
            'rgba(255,99,13, 0.6)',
            'rgba(200,99,12, 0.6)',
            'rgba(255,0,132, 0.6)'
          ]
        }
      ]
    };

    if (!this.newData || !this.newLabel) return null;

    return (
      <div>
        <ButtonOutline.Secondary onClick={this.updateChart}>Oppdater</ButtonOutline.Secondary>
        <div className="chart">
          <Bar
            data={chartData}
            height={30}
            width={140}
            options={
              ({
                maintainAspectRatio: false
              },
              {
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        stepSize: Math.max.apply(this.newData) / 5
                      }
                    }
                  ]
                },
                animation: {
                  duration: 1000,
                  animateScale: true
                }
              })
            }
          />
        </div>
      </div>
    );
  }

  //Brukes til å oppdatere charts når den tid kommer alt etter år :)
  updateChart() {
    let tempData = [];
    let tempLabel = [];

    this.newData = [];
    this.newLabel = [];

    rentalService.getMonthlyPrice(newdata => {
      for (let i = 0; i < newdata.length; i++) {
        tempData.push(newdata[i].sumPrice);
        tempLabel.push(this.months[newdata[i].month - 1]);
      }

      this.newData = tempData;
      this.newLabel = tempLabel;
    });
  }

  mounted() {
    let tempData = [];
    let tempLabel = [];

    this.newData = [];
    this.newLabel = [];

    rentalService.getMonthlyPrice(newdata => {
      for (let i = 0; i < newdata.length; i++) {
        tempData.push(newdata[i].sumPrice);
        tempLabel.push(this.months[newdata[i].month - 1]);
      }

      this.newData = tempData;
      this.newLabel = tempLabel;
    });
  }
}

// class DetailedOrderAll extends Component {
//   bikes = [];
//   equipments = [];
//   sales = [];
//   orderDate = '';
//   fromDate = '';
//   toDate = '';
//
//   render() {
//     let notice;
//
//     if (this.equipments.length == 0) {
//       notice = (
//         <Table.Tr>
//           <Table.Td>Det ble ikke funnet noe utstyr knyttet til denne bestillingen.</Table.Td>
//         </Table.Tr>
//       );
//     }
//
//     return (
//       <div>
//         <H1>Se på bestilling</H1>
//         <br />
//         <Card>
//           Ordren er registrert på {this.sales.firstName} {this.sales.lastName} på tid/dato {this.orderDate}. Utleien
//           varer fra {this.fromDate} til {this.toDate}.
//           <br /> <br />
//           <Row>
//             <Column>
//               <Table>
//                 <Table.Thead>
//                   <Table.Th>ID</Table.Th>
//                   <Table.Th>Sykkeltype</Table.Th>
//                   <Table.Th>Merke</Table.Th>
//                   <Table.Th>Modell</Table.Th>
//                   <Table.Th>År</Table.Th>
//                   <Table.Th>Rammestr.</Table.Th>
//                   <Table.Th>Hjulstr.</Table.Th>
//                   <Table.Th>Gir</Table.Th>
//                   <Table.Th>Bremsesystem</Table.Th>
//                   <Table.Th>Vekt</Table.Th>
//                   <Table.Th>Kjønn</Table.Th>
//                   <Table.Th>Pris</Table.Th>
//                 </Table.Thead>
//                 <Table.Tbody>
//                   {this.bikes.map(bike => (
//                     <Table.Tr key={bike.id}>
//                       <Table.Td>{bike.id}</Table.Td>
//                       <Table.Td>{bike.typeName}</Table.Td>
//                       <Table.Td>{bike.brand}</Table.Td>
//                       <Table.Td>{bike.model}</Table.Td>
//                       <Table.Td>{bike.year}</Table.Td>
//                       <Table.Td>{bike.frameSize}</Table.Td>
//                       <Table.Td>{bike.wheelSize}</Table.Td>
//                       <Table.Td>
//                         {bike.gearSystem} ({bike.gears})
//                       </Table.Td>
//                       <Table.Td>{bike.brakeSystem}</Table.Td>
//                       <Table.Td>{bike.weight_kg} kg</Table.Td>
//                       <Table.Td>{bike.suitedFor}</Table.Td>
//                       <Table.Td>{bike.price} kr</Table.Td>
//                     </Table.Tr>
//                   ))}
//                 </Table.Tbody>
//               </Table>
//             </Column>
//           </Row>
//           <Row>
//             <Column width={8}>
//               <Table>
//                 <Table.Thead>
//                   <Table.Th>Utstyrstype</Table.Th>
//                   <Table.Th>Merke</Table.Th>
//                   <Table.Th>År</Table.Th>
//                   <Table.Th>Kommentar</Table.Th>
//                   <Table.Th>Pris</Table.Th>
//                 </Table.Thead>
//                 <Table.Tbody>
//                   {notice}
//                   {this.equipments.map(equipment => (
//                     <Table.Tr key={equipment.id}>
//                       <Table.Td>{equipment.typeName}</Table.Td>
//                       <Table.Td>{equipment.brand}</Table.Td>
//                       <Table.Td>{equipment.year}</Table.Td>
//                       <Table.Td>{equipment.comment}</Table.Td>
//                       <Table.Td>{equipment.price}</Table.Td>
//                     </Table.Tr>
//                   ))}
//                 </Table.Tbody>
//               </Table>
//             </Column>
//           </Row>
//           <Column>
//             <h4 align="right">Totalpris: {this.sales.price} kr</h4>
//             <Button.Success align="left" type="button" onClick={() => history.push('/Overview/')}>
//               Gå tilbake til forsiden
//             </Button.Success>
//           </Column>
//         </Card>
//       </div>
//     );
//   }
//
//   mounted() {
//     orderService.getBikesFromOrder(this.props.match.params.id, bikes => {
//       this.bikes = bikes;
//     });
//
//     orderService.getEquipmentFromOrder(this.props.match.params.id, equipments => {
//       this.equipments = equipments;
//     });
//
//     rentalService.getAllSales(sales => {
//       this.sales = sales[this.props.match.params.id - 1];
//       this.orderDate = this.sales.dateOrdered.toString().substring(4, 24);
//       this.fromDate = this.sales.fromDateTime.toString().substring(4, 24);
//       this.toDate = this.sales.toDateTime.toString().substring(4, 24);
//     });
//   }
// }

class RentedBikes extends Component {
  todaysDate = year + '-' + month + '-' + day + '%';

  rentedBikes = [];
  orderedBikes = [];

  render() {
    return (
      <div>
        <Row>
          <Column>
            <Card title="Utleide sykler:">
              <br />
              <Table>
                <Table.Thead>
                  <Table.Th>SykkelID</Table.Th>
                  <Table.Th>Sykkeltype</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.rentedBikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.name}</Table.Td>
                      <Table.Td>{bike.bikeStatus}</Table.Td>
                      <Table.Td>
                        <NavLink to={'/selected/' + bike.id}>
                          <ButtonOutline.Info style={{ float: 'right' }}>Innlevering</ButtonOutline.Info>
                        </NavLink>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
            <br />
          </Column>

          <Column>
            <Card title="Bestilte sykler:">
              <br />
              <Table>
                <Table.Thead>
                  <Table.Th>OrderID</Table.Th>
                  <Table.Th>Kunde</Table.Th>
                  <Table.Th>SykkelID</Table.Th>
                  <Table.Th>Sykkeltype</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                  <Table.Th>Fradato</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.orderedBikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.order_id}</Table.Td>
                      <Table.Td>
                        {bike.firstName} {bike.lastName}
                      </Table.Td>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.name}</Table.Td>
                      <Table.Td>{bike.fromDateTime.toString().substring(4, 16)}</Table.Td>
                      <Table.Td>
                        <NavLink to={'/selected/' + bike.id}>
                          <ButtonOutline.Info style={{ float: 'right' }}>Utlevering</ButtonOutline.Info>
                        </NavLink>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          </Column>
        </Row>
        <br />
      </div>
    );
  }

  mounted() {
    rentalService.getRentedBikes(rented => {
      this.rentedBikes = rented;
    });

    rentalService.getOrderedBikes(this.todaysDate, ordered => {
      this.orderedBikes = ordered;
    });
  }
}

class Selected extends Component {
  bike = [];
  bikeType = '';
  bikeLoc = '';
  bikeStatus = '';
  locations = [];
  note = '';
  state = {
    location_id: null,
    statusOnBike: ['OK', 'Til Reperasjon', 'Trenger Reperasjon', 'Trenger Service', 'Må flyttes', 'Stjålet', 'Utleid']
  };

  render() {
    if (!this.bike) return null;

    return (
      <div>
        <Card title={'Sykkel med id: ' + this.props.match.params.id}>
          <img src="../pictures/bike.svg" width="30%" />
          <Table>
            <Table.Thead>
              <Table.Th>Sykkel id</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Merke og modell</Table.Th>
              <Table.Th>Lokasjon</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Thead>

            <Table.Tbody>
              <Table.Tr>
                <Table.Td>{this.props.match.params.id}</Table.Td>
                <Table.Td>{this.bike.typeName}</Table.Td>
                <Table.Td>
                  {this.bike.brand} {this.bike.model}
                </Table.Td>
                <Table.Td>
                  <Select name="locationSelect" value={this.bikeLoc} onChange={this.onChangeLocation}>
                    {this.locations.map(loc => (
                      <Select.Option key={loc.id} dataKey={loc.id}>
                        {loc.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Table.Td>
                <Table.Td>
                  <Select
                    name="status"
                    value={this.bikeStatus}
                    onChange={event => (this.bikeStatus = event.target.value)}
                  >
                    {this.state.statusOnBike.map(status => (
                      <Select.Option key={status}>{status}</Select.Option>
                    ))}
                  </Select>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <br />
          <br />
          <CenterContent>
            <div className="form-group">
              <Form.Label htmlFor="comment">
                <b>Skriv inn en kommentar om sykkelen:</b>
              </Form.Label>
              <textarea
                className="form-control"
                id="comment"
                row="200"
                cols="100"
                value={this.note}
                onChange={event => (this.note = event.target.value)}
              />
            </div>
          </CenterContent>

          <Row>
            <Column>
              <ButtonOutline.Success
                onClick={e => {
                  if (window.confirm('Er du sikker på at informasjonen er korrekt?')) this.change(e);
                }}
              >
                Lagre
              </ButtonOutline.Success>
            </Column>

            <Column right>
              <ButtonOutline.Secondary onClick={this.cancel}>Cancel</ButtonOutline.Secondary>
            </Column>
          </Row>
        </Card>

        <br />
      </div>
    );
  }

  mounted() {
    rentalService.getLocations(result => {
      this.locations = result;
    });

    bikeService.getBike(this.props.match.params.id, result => {
      this.bike = result;
      this.bikeLoc = result.name;
      this.bikeType = result.typeName;
      this.bikeStatus = result.bikeStatus;
      this.state.location_id = result.location_id;
      if (result.bikeNote == null) {
        this.note = '';
      } else {
        this.note = result.bikeNote;
      }
    });
  }

  onChangeLocation(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.bikeLoc = event.target.value;
    this.setState({ state: (this.state.location_id = event.target.options[selectedIndex].getAttribute('data-key')) });
    console.log(this.state.location_id);
  }

  change() {
    console.log(this.state.location_id);
    if (this.state.location_id == null) {
    } else {
      bikeService.updateBikes(this.props.match.params.id, this.bikeStatus, this.state.location_id, this.note);
      console.log(this.bikeLoc, this.bikeType, this.bikeStatus, this.note);
      history.push('/overview/');
    }
  }

  cancel() {
    history.push('/overview/');
  }
}

class Overview extends Component {
  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Oversikt</h1>
        </NavBar>
        <Card style={{ minWidth: '400px' }}>
          <Chart />
        </Card>
        <br />
        <RentedBikes />
      </div>
    );
  }
}

module.exports = { Overview };
