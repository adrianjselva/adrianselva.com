import React, {Fragment} from 'react';
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Layout from "../components/layout";
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import Tab from 'react-bootstrap/Tab'
import TabContainer from 'react-bootstrap/TabContainer'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import CountyScroll from '../components/county_scroll'
import Tabs from 'react-bootstrap/Tabs'

import CountyData from '../assets/counties.json'
import MapData from '../assets/maps.json'
import GeoJSON from '../assets/county_geojson.json'

const PLOT_COMPONENT = {
  plotly: dynamic(import('../components/plot'), {
      ssr: false
  })
}

const DynamicPlot = PLOT_COMPONENT.plotly

class TNCovid extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      type: 'active_cases',
      county: '',
      data: null,
      layout: null,
      map_type: 'daily_cases_map',
      map_data: this.plotObject(MapData['daily_cases_map']).data,
      map_layout: this.plotObject(MapData['daily_cases_map']).layout,
      menu: {
        active: 'active_cases',
        total: 'total_cases',
        daily: 'daily_cases',
        testing: 'testing'
      }
    };
  }

  plotObject(obj) {
    if(obj == null) {
      return {
        data: {},
        layout: {}
      };
    }

    if(obj.type == "total") {
      return this.totalPlot(obj.xval, obj.yval, obj.linecolor, obj.gtitle, obj.ytitle);
    } else if(obj.type == "daily") {
      return this.dailyPlot(obj.xval, obj.yval, obj.barcolor, obj.fillcolor, obj.movingAverage, obj.movingLineColor, obj.gtitle, obj.ytitle);
    } else if(obj.type == "testing") {
      return this.testPlot(obj.xval, obj.totalTestVal, obj.positiveVals, obj.percentPositive, obj.gtitle)
    } else if(obj.type == "map") {
      return this.countyMap(obj.fips, obj.z)
    } else {
      return {
        data: {},
        layout: {}
      };
    }
  }

  totalPlot(xval, yval, linecolor, gtitle, ytitle) {
    let data = [{
      x: xval,
      y: yval,
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        color: linecolor
      }
    }
  ];

    let layout = {
      title: gtitle,
      xaxis: {
        title: "Date"
      },
      yaxis: {
        title: ytitle
      }
    };

    return {
      data: data,
      layout: layout
    }
  }

  dailyPlot(xval, yval, barcolor, fillcolor, movingAverage, movingLineColor, gtitle, ytitle) {
    let data = [{
      x: xval,
      y: yval,
      type: 'bar',
      mode: 'lines+markers',
      marker: {
        color: barcolor
      },
      hoverinfo: 'x+y'
    },
    {
      x: xval,
      y: movingAverage,
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      fillcolor: fillcolor,
      line: {
        color: movingLineColor
      },
      hoverinfo: 'skip'
    }
  ];

    let layout = {
      title: gtitle,
      xaxis: {
        title: "Date"
      },
      yaxis: {
        title: ytitle
      },
      showlegend: false
    };

    return {
      data: data,
      layout: layout
    }
  }

  testPlot(xval, totalTestVal, positiveVals, percentPositive, gtitle) {
    let data = [{
      x: xval,
      y: totalTestVal,
      type: 'bar',
      name: 'Total Tests',
      hoverinfo: 'x+y',
      marker: {
        color: 'rgb(206, 162, 219)'
      }
    },
    {
      x: xval,
      y: positiveVals,
      type: 'bar',
      name: 'Positive Tests',
      hoverinfo: 'x+y',
      marker: {
        color: 'rgb(0, 182, 199)'
      }
    },
    {
      x: xval,
      y: percentPositive,
      type: 'scatter',
      mode: 'lines',
      name: 'Positive (%)',
      yaxis: 'y2',
      hoverinfo: 'x+y',
      line: {
        color: 'rgb(191, 23, 23)'

      }
    }];

    let layout = {
      xaxis: {
        title: 'Date'
      },
      yaxis: {
        title: 'Daily Tests'
      },
      yaxis2: {
        overlaying: "y",
        side: "right",
        title: "Positive (%)",
        rangemode: 'tozero',
        showgrid: false
      },
      barmode: 'overlay',
      title: gtitle,
      legend: {
        y: -.3,
        orientation: 'h'
      },
      margin: {
        r: 45
      }
    }

    return {
      data: data,
      layout: layout
    }

  }

  changePlots(type) {
    if(this.state.type == type) {
      return;
    }

    let cData = CountyData[this.state.county][type]
    let gObj = this.plotObject(cData);

    this.setState({
      type: type,
      county: this.state.county,
      data: gObj.data,
      layout: gObj.layout,
      map_type: this.state.map_type,
      map_data: this.state.map_data,
      map_layout: this.state.map_layout,
      menu: {
        active: this.state.menu.active,
        total: this.state.menu.total,
        daily: this.state.menu.daily,
        testing: this.state.menu.testing
      }
    });
  }

  updateCounty(county) {
    let cData = CountyData[county][this.state.type];

    let gObj = this.plotObject(cData);

    this.setState({
      type: this.state.type,
      county: county,
      data: gObj.data,
      layout: gObj.layout,
      map_type: this.state.map_type,
      map_data: this.state.map_data,
      map_layout: this.state.map_layout,
      menu: {
        active: this.state.menu.active,
        total: this.state.menu.total,
        daily: this.state.menu.daily,
        testing: this.state.menu.testing
      }
    });
  }

  countySelectorTitle() {
    if(this.state.county == '') {
      return "Select a county";
    } else {
      return this.state.county;
    }
  }

  menuClick(type) {
    if(this.state.county == '') {
      this.setState({
        type: type,
        county: this.state.county,
        data: this.state.data,
        layout: this.state.layout,
        map_type: this.state.map_type,
        map_data: this.state.map_data,
        map_layout: this.state.map_layout,
        menu: {
          active: this.state.menu.active,
          total: this.state.menu.total,
          daily: this.state.menu.daily,
          testing: this.state.menu.testing
        }
      });
    } else {
      this.changePlots(type)
    }
  }

  countyMap(fips, z) {
    let data = [{
      type: "choroplethmapbox",
      geojson: GeoJSON,
      locations: fips,
      z: z,
      featureidkey: "properties.FIPS",
      colorscale: 'Viridis'
    }];

    let layout = {
      mapbox: {
        style: "carto-positron",
        zoom: 5,
        center: {
          lat: 35.51,
          lon: -86
        }
      },
      title: "Daily Confirmed COVID-19 Cases"
    }

    return {
      data: data,
      layout: layout
    }
  }

  updateMenu(cat, type) {
    if(this.state.county == '') {
      let s = {
        type: type,
        county: this.state.county,
        data: this.state.data,
        layout: this.state.layout,
        map_type: this.state.map_type,
        map_data: this.state.map_data,
        map_layout: this.state.map_layout,
        menu: {
          active: this.state.menu.active,
          total: this.state.menu.total,
          daily: this.state.menu.daily,
          testing: this.state.menu.testing
        }
      };

      s.menu[cat] = type;
      this.setState(s);
    } else {
      let cData = CountyData[this.state.county][type]
      let gObj = this.plotObject(cData);


      let s = {
        type: type,
        county: this.state.county,
        data: gObj.data,
        layout: gObj.layout,
        map_type: this.state.map_type,
        map_data: this.state.map_data,
        map_layout: this.state.map_layout,
        menu: {
          active: this.state.menu.active,
          total: this.state.menu.total,
          daily: this.state.menu.daily,
          testing: this.state.menu.testing
        }
      };

      s.menu[cat] = type;
      this.setState(s);
      console.log(s);
    }
  }


  render() {
    return (
      <Layout title="TN COVID-19 Data">
        <div className="mt-5 mb-5">
        <Container fluid>
          <Row>
            <Col md="auto">
              <Tabs defaultActiveKey="county_level" id="selection_menu" variant='pills'>
                <Tab eventKey="county_level" title="County level">
                  <div className="mt-2">
                    <Tabs onSelect={(key, evnt) => {this.updateMenu(key, this.state.menu[key])}} defaultActiveKey="active" id="total_daily" variant='pills'>
                      <Tab eventKey="active" title="Active">
                      <div className="mt-2">
                        <Tab.Container id="active_selection" defaultActiveKey="active_cases">
                          <ListGroup>
                            <ListGroup.Item action onClick={() => {this.updateMenu("active", "active_cases")}} eventKey="active_cases">Current Active Cases</ListGroup.Item>
                          </ListGroup>
                        </Tab.Container>
                      </div>
                      </Tab>
                        <Tab eventKey="total" title="Total">
                        <div className="mt-2">
                          <Tab.Container id="total_selection" defaultActiveKey="total_cases">
                            <ListGroup>
                              <ListGroup.Item action onClick={() => {this.updateMenu("total", "total_cases")}} eventKey="total_cases">Cases</ListGroup.Item>
                              <ListGroup.Item action onClick={() => {this.updateMenu("total", "total_deaths")}} eventKey="total_deaths">Deaths</ListGroup.Item>
                              <ListGroup.Item action onClick={() => {this.updateMenu("total", "total_recoveries")}} eventKey="total_recoveries">Recoveries</ListGroup.Item>
                              <ListGroup.Item action onClick={() => {this.updateMenu("total", "total_hospitalized")}} eventKey="total_hospitalized">Hospitalizations</ListGroup.Item>
                            </ListGroup>
                          </Tab.Container>
                        </div>
                        </Tab>
                      <Tab eventKey="daily" title="Daily">
                      <div className="mt-2">
                        <Tab.Container id="daily_selection" defaultActiveKey="daily_cases">
                          <ListGroup>
                            <ListGroup.Item action onClick={() => {this.updateMenu("daily", "daily_cases")}} eventKey="daily_cases">Cases</ListGroup.Item>
                            <ListGroup.Item action onClick={() => {this.updateMenu("daily", "daily_deaths")}} eventKey="daily_deaths">Deaths</ListGroup.Item>
                            <ListGroup.Item action onClick={() => {this.updateMenu("daily", "daily_active")}} eventKey="daily_active">Daily Active</ListGroup.Item>
                            <ListGroup.Item action onClick={() => {this.updateMenu("daily", "daily_recoveries")}} eventKey="daily_recoveries">Daily Recoveries</ListGroup.Item>
                            <ListGroup.Item action onClick={() => {this.updateMenu("daily", "daily_hospitalized")}} eventKey="daily_hospitalized">Hospitalizations</ListGroup.Item>
                          </ListGroup>
                        </Tab.Container>
                      </div>
                      </Tab>
                      <Tab eventKey="testing" title="Testing">
                      <div className="mt-2">
                        <Tab.Container id="testing_selection" defaultActiveKey="testing">
                          <ListGroup>
                            <ListGroup.Item action onClick={() => {this.updateMenu("testing", "testing")}} eventKey="testing">Testing Data</ListGroup.Item>
                          </ListGroup>
                        </Tab.Container>
                      </div>
                      </Tab>
                    </Tabs>
                  </div>
                </Tab>
                <Tab eventKey="statewide" title="Statewide">
                </Tab>
              </Tabs>
            </Col>
          <Col>
            <Row className="justify-content-center">
              <Card>
                <Card.Header>County Map</Card.Header>
                <Card.Body>
                <div className="mb-4">
                  <CountyScroll title={this.countySelectorTitle()} func={this.updateCounty.bind(this)} />
                </div>
                </Card.Body>
              </Card>
            </Row>
            <div className="mt-5"></div>
            <Row className="justify-content-center">
            <Card>
              <Card.Header>Visualization</Card.Header>
              <Card.Body>
                <DynamicPlot data={this.state.data} layout={this.state.layout}/>
              </Card.Body>
            </Card>
            </Row>
            <Row className="mt-5 justify-content-center">
              <Col>
                <Row className="justify-content-center">
                  {"Source:"}<a href="https://www.tn.gov/health/cedep/ncov.html"> Tennessee Department of Health</a>
                </Row>
                <Row className="justify-content-center">
                  {"Last updated: June 10, 2020"}
                </Row>
              </Col>
            </Row>
          </Col>
          </Row>
        </Container>
        <div style = {{height:"100vh"}}> </div>
        </div>
      </Layout>
    )
  }
}

// <Tab.Container id="graph-selection" defaultActiveKey="total_cases">
//   <ListGroup>
//     <ListGroup.Item action onClick={() => this.menuClick("total_cases")} eventKey="total_cases">Total Cases</ListGroup.Item>
//     <ListGroup.Item action onClick={() => this.menuClick("daily_cases")} eventKey="daily_cases">Daily Cases</ListGroup.Item>
//     <ListGroup.Item action onClick={() => this.menuClick("total_deaths")} eventKey="total_deaths">Total Deaths</ListGroup.Item>
//     <ListGroup.Item action onClick={() => this.menuClick("daily_deaths")} eventKey="daily_deaths">Daily Deaths</ListGroup.Item>
//     <ListGroup.Item action onClick={() => this.menuClick("testing")} eventKey="testing">Testing Data</ListGroup.Item>
//     <ListGroup.Item action onClick={() => this.menuClick("active_cases")} eventKey="active_cases">Active Cases</ListGroup.Item>
//     <ListGroup.Item action onClick={() => this.menuClick("daily_active")} eventKey="daily_active">Daily Active Cases</ListGroup.Item>
//     <ListGroup.Item action onClick={() => this.menuClick("total_recoveries")} eventKey="total_recoveries">Total Recoveries</ListGroup.Item>
//     <ListGroup.Item action onClick={() => this.menuClick("daily_recoveries")} eventKey="daily_recoveries">Daily Recoveries</ListGroup.Item>
//     <ListGroup.Item action onClick={() => this.menuClick("total_hospitalized")} eventKey="total_hospitalized">Total Hospitalized</ListGroup.Item>
//     <ListGroup.Item action onClick={() => this.menuClick("daily_hospitalized")} eventKey="daily_hospitalized">Daily Hospitalized</ListGroup.Item>
//   </ListGroup>
//   </Tab.Container>

export default TNCovid;
