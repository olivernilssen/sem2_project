import * as React from 'react';
import { Component } from 'react-simplified';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';

import { start } from 'repl';
import { connection } from './mysql_connection';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class Chart extends Component {
  sales = [];
  months = [];

  constructor(props) {
    super(props);
    this.state = {
      chartData: {
        labels: [this.months],
        datasets: [
          {
            label: 'Salg',
            data: [this.sales],
            backgroundColor: [
              'rgba(130,99,132, 0.6)',
              'rgba(255,99,13, 0.6)',
              'rgba(200,99,12, 0.6)',
              'rgba(255,99,132, 0.6)',
              'rgba(255,0,132, 0.6)'
            ]
          }
        ]
      }
    };
  }

  render() {
    return (
      <div className="chart">
        <Bar
          data={this.state.chartData}
          height={300}
          width={150}
          options={{
            maintainAspectRatio: false
          }}
        />
      </div>
    );
  }

  mounted() {
    this.state.sales = [];

    rentalService.getMonthlyPrice(sales => {
      this.sales = sales;
    });
  }
}

class Overview extends Component {
  render() {
    return (
      <div>
        <Card title="Oversikt">
          <Chart />
        </Card>
      </div>
    );
  }
}

module.exports = { Overview };