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
import Tabs from 'react-bootstrap/Tabs'
import Spinner from 'react-bootstrap/Spinner'

import CountyData from '../assets/counties.json'
import CountyGeoJSON from '../assets/county_geojson.json'
import CountyMapData from '../assets/cmaps.json'

import StateData from '../assets/state.json'
import StateGeoJSON from '../assets/tn_geojson.json'
import StateMapData from '../assets/smaps.json'

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

    this.state = {
      stype: 'active_cases',
      ctype: 'active_cases',
      view: 'state',
      county: '',
      data: this.plotObject(StateData['active_cases']).data,
      layout: this.plotObject(StateData['active_cases']).layout,
      map_data: this.plotObject(StateMapData['active_cases']).data,
      map_layout: this.plotObject(StateMapData['active_cases']).layout,
      menu: {
        active: 'active_cases',
        total: 'total_cases',
        daily: 'daily_cases',
        testing: 'testing'
      },
      state_menu: {
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
    } else if(obj.type == "cmap") {
      return this.countyMap(obj.counties, obj.z, obj.mtitle, obj.hovtext, obj.col1, obj.col2, obj.col3, obj.col4, obj.col5)
    } else if(obj.type == "smap") {
      return this.stateMap(obj.z, obj.hovtext, obj.col, obj.mtitle)
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
        title: "Date",
        tickfont: {
          color: 'black'
        }
      },
      yaxis: {
        title: ytitle,
        tickfont: {
          color: 'black'
        }
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
        title: "Date",
        tickfont: {
          color: 'black'
        }
      },
      yaxis: {
        title: ytitle,
        tickfont: {
          color: 'black'
        }
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
        title: 'Date',
        tickfont: {
          color: 'black'
        }
      },
      yaxis: {
        title: 'Daily Tests',
        tickfont: {
          color: 'black'
        }
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

  updateCounty(county) {
    let cData = CountyData[county][this.state.ctype];
    let gObj = this.plotObject(cData);

    this.setState({
      ctype: this.state.ctype,
      stype: this.state.stype,
      view: this.state.view,
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
      },
      state_menu: this.state.state_menu
    });
  }

  countyMap(counties, z, mtitle, hovtext, col1, col2, col3, col4, col5) {
    let hov_temp = '<br>' + hovtext + ' %{z}<extra></extra>'

    let data = [{
      type: "choroplethmapbox",
      geojson: CountyGeoJSON,
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
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 30,
        pad: 2
      }
    }

    return {
      data: data,
      layout: layout
    }
  }

  stateMap(z, hovtext, col, mtitle) {
    let hov_temp = '<br>' + hovtext + ' %{z}<extra></extra>'

    let data = [{
      type: "choroplethmapbox",
      geojson: StateGeoJSON,
      locations: ["Tennessee"],
      z: [z],
      featureidkey: "properties.NAME",
      colorscale: [
        ['0.0', 'rgb(255, 255, 255)'],
        ['1.0', col]
      ],
      hovertemplate:
        '<b>%{location}</b>' +
        hov_temp,
      marker: {
         opacity: 0.75
       },
      showscale: false
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
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 30,
        pad: 2
      }
    }

    return {
      data: data,
      layout: layout
    }
  }

  updateMenu(cat, type) {
    if(this.state.view == 'county') {
      if(this.state.county == '') {
        let mData = CountyMapData[type];
        let mObj = this.plotObject(mData);

        let s = {
          stype: this.state.stype,
          ctype: type,
          view: this.state.view,
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
          },
          state_menu: this.state.state_menu
        };

        s.menu[cat] = type;
        this.setState(s);
      } else {
        let cData = CountyData[this.state.county][type];
        let gObj = this.plotObject(cData);

        let mData = CountyMapData[type];
        let mObj = this.plotObject(mData);


        let s = {
          stype: this.state.stype,
          ctype: type,
          view: this.state.view,
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
          },
          state_menu: this.state.state_menu
        };

        s.menu[cat] = type;
        this.setState(s);
      }
    } else if (this.state.view == 'state') {
      let sData = StateData[type];
      let gObj = this.plotObject(sData);

      let mData = StateMapData[type];
      let mObj = this.plotObject(mData);

      let s = {
        stype: type,
        ctype: this.state.ctype,
        view: this.state.view,
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
        },
        state_menu: this.state.state_menu
      };

      s.state_menu[cat] = type;
      this.setState(s);
    }
  }

  updateView(view) {
    if(view == 'state') {
      let sData = StateData[this.state.stype];
      let gObj = this.plotObject(sData);

      let mData = StateMapData[this.state.stype];
      let mObj = this.plotObject(mData);

      let s = {
        stype: this.state.stype,
        ctype: this.state.ctype,
        view: view,
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
        },
        state_menu: this.state.state_menu
      };

      this.setState(s);
    } else if(view == 'county' && this.state.county != '') {
      let cData = CountyData[this.state.county][this.state.ctype];
      let gObj = this.plotObject(cData);

      let mData = CountyMapData[this.state.ctype];
      let mObj = this.plotObject(mData);

      let s = {
        stype: this.state.stype,
        ctype: this.state.ctype,
        view: view,
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
        },
        state_menu: this.state.state_menu
      };

      this.setState(s);
    } else {
      let mData = CountyMapData[this.state.ctype];
      let mObj = this.plotObject(mData);

      let s = {
        stype: this.state.stype,
        ctype: this.state.ctype,
        view: view,
        county: this.state.county,
        data: null,
        layout: null,
        map_data: mObj.data,
        map_layout: mObj.layout,
        menu: {
          active: this.state.menu.active,
          total: this.state.menu.total,
          daily: this.state.menu.daily,
          testing: this.state.menu.testing
        },
        state_menu: this.state.state_menu
      };

      this.setState(s);
    }
  }

  handleMapClick(obj) {
    if(this.state.view == 'county') {
      this.updateCounty(obj.points[0].properties.NAME);
    } else {
      return;
    }
  }


  render() {
    return (
      <Layout title="TN COVID-19 Data">
        <div className="mt-3 mb-3">
        <Container fluid>
          <Row>
            <Col xl={4}>
            <div className="mb-5">
              <Tabs onSelect={(key, evnt) => {this.updateView(key);}} defaultActiveKey="state" id="selection_menu" variant='pills'>
                <Tab eventKey="state" title="Statewide">
                  <div className="mt-2">
                    <Tabs onSelect={(key, evnt) => {this.updateMenu(key, this.state.state_menu[key])}} defaultActiveKey="active" id="total_daily" variant='pills'>
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
                            <ListGroup.Item action onClick={() => {this.updateMenu("daily", "daily_active")}} eventKey="daily_active">Active</ListGroup.Item>
                            <ListGroup.Item action onClick={() => {this.updateMenu("daily", "daily_recoveries")}} eventKey="daily_recoveries">Recoveries</ListGroup.Item>
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
                <Tab eventKey="county" title="County level">
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
                            <ListGroup.Item action onClick={() => {this.updateMenu("daily", "daily_active")}} eventKey="daily_active">Active</ListGroup.Item>
                            <ListGroup.Item action onClick={() => {this.updateMenu("daily", "daily_recoveries")}} eventKey="daily_recoveries">Recoveries</ListGroup.Item>
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
              </Tabs>
              </div>
            </Col>
          <Col xl={8}>
            <Row className="justify-content-center">
              <div style={{width: "100%", height: "100%"}}>
              <Card>
                <Card.Header>County Map</Card.Header>
                <Card.Body>
                <div className="mb-4">
                  <DynamicPlot data={this.state.map_data} layout={this.state.map_layout} onClick={(obj) => {this.handleMapClick(obj)}}/>
                </div>
                </Card.Body>
              </Card>
              </div>
            </Row>
            <div className="mt-5"></div>
            <Row className="justify-content-center">
            <div style={{width: "100%", height: "100%"}}>
            <Card>
              <Card.Header>Visualization</Card.Header>
              <Card.Body>
                <DynamicPlot data={this.state.data} layout={this.state.layout} onClick={() => {}}/>
              </Card.Body>
            </Card>
            </div>
            </Row>
            <Row className="mt-5 justify-content-center">
              <Col>
                <Row className="justify-content-center">
                  {"Source:"}<a href="https://www.tn.gov/health/cedep/ncov.html"> Tennessee Department of Health</a>
                </Row>
                <Row className="justify-content-center">
                  {"Last updated: June 17, 2020"}
                </Row>
              </Col>
            </Row>
          </Col>
          </Row>
        </Container>
        </div>
      </Layout>
    )
  }
}

export default TNCovid;
