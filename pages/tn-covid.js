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
import Spinner from 'react-bootstrap/Spinner'

import CountyData from '../assets/counties.json'
import MapData from '../assets/maps.json'
import GeoJSON from '../assets/county_geojson.json'

const PLOT_COMPONENT = {
  plotly: dynamic(import('../components/plot'), {
      ssr: false,
      loading: () => {
        return(
        <div className="justify-content-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )
      }
  })
};

const DynamicPlot = PLOT_COMPONENT.plotly;

class TNCovid extends React.Component {

  constructor(props) {
    super(props)

    console.log(MapData)

    this.state = {
      type: 'active_cases',
      county: '',
      data: null,
      layout: null,
      map_data: this.plotObject(MapData['active_cases']).data,
      map_layout: this.plotObject(MapData['active_cases']).layout,
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
      return this.countyMap(obj.counties, obj.z, obj.mtitle, obj.hovtext, obj.col1, obj.col2, obj.col3, obj.col4, obj.col5)
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

    let cData = CountyData[this.state.county][type];
    let gObj = this.plotObject(cData);

    let mData =

    this.setState({
      type: type,
      county: this.state.county,
      data: gObj.data,
      layout: gObj.layout,
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

  countyMap(counties, z, mtitle, hovtext, col1, col2, col3, col4, col5) {
    let hov_temp = '<br>' + hovtext + ' %{z}<extra></extra>'

    let data = [{
      type: "choroplethmapbox",
      geojson: GeoJSON,
      locations: counties,
      z: z,
      featureidkey: "properties.NAME",
      colorscale: [
        ['0.0', col1],
        ['0.25', col2],
        ['0.5', col3],
        ['0.75', col4],
        ['1.0', col5]
      ],
      hovertemplate:
        '<b>%{location}</b>' +
        hov_temp,
      marker: {
         opacity: 0.75
       }
    }];

    let layout = {
      mapbox: {
        style: "light",
        zoom: 5.35,
        center: {
          lat: 35.51,
          lon: -86
        }
      },
      title: mtitle,
    }

    return {
      data: data,
      layout: layout
    }
  }

  updateMenu(cat, type) {
    if(this.state.county == '') {
      let mData = MapData[type];
      let mObj = this.plotObject(mData);

      let s = {
        type: type,
        county: this.state.county,
        data: this.state.data,
        layout: this.state.layout,
        map_data: mObj.data,
        map_layout: mObj.layout,
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
      let cData = CountyData[this.state.county][type];
      let gObj = this.plotObject(cData);

      let mData = MapData[type];
      let mObj = this.plotObject(mData);


      let s = {
        type: type,
        county: this.state.county,
        data: gObj.data,
        layout: gObj.layout,
        map_data: mObj.data,
        map_layout: mObj.layout,
        menu: {
          active: this.state.menu.active,
          total: this.state.menu.total,
          daily: this.state.menu.daily,
          testing: this.state.menu.testing
        }
      };

      s.menu[cat] = type;
      this.setState(s);
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
                  <DynamicPlot data={this.state.map_data} layout={this.state.map_layout} onClick={(obj) => {this.updateCounty(obj.points[0].properties.NAME)}}/>
                </div>
                </Card.Body>
              </Card>
            </Row>
            <div className="mt-5"></div>
            <Row className="justify-content-center">
            <Card>
              <Card.Header>Visualization</Card.Header>
              <Card.Body>
                <DynamicPlot data={this.state.data} layout={this.state.layout} onClick={() => {}}/>
              </Card.Body>
            </Card>
            </Row>
            <Row className="mt-5 justify-content-center">
              <Col>
                <Row className="justify-content-center">
                  {"Source:"}<a href="https://www.tn.gov/health/cedep/ncov.html"> Tennessee Department of Health</a>
                </Row>
                <Row className="justify-content-center">
                  {"Last updated: June 11, 2020"}
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

export default TNCovid;
