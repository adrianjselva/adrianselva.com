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
import CountyMapData from '../assets/cmaps.json'

import StateData from '../assets/state.json'
import StateMapData from '../assets/smaps.json'

const AbstractPlot = dynamic(import('../components/plots/abstract_plot'), {
      ssr: false,
      loading: () => {
        return(
        <div style={{textAlign: 'center'}}>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )
      }
  });

const AbstractMap = dynamic(import('../components/maps/abstract_map'), {
      ssr: false,
      loading: () => {
        return(
        <div style={{textAlign: 'center'}}>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
        )
        }
  });

class TNCovid extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      stype: 'active_cases',
      ctype: 'active_cases',
      view: 'state',
      county: '',
      mapTitle: StateMapData['active_cases'].mtitle,
      graphTitle: StateData['active_cases'].gtitle,
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

  updateCounty(county) {
    let cData = CountyData[county][this.state.ctype];

    this.setState({
      ctype: this.state.ctype,
      stype: this.state.stype,
      view: this.state.view,
      county: county,
      mapTitle: this.state.mapTitle,
      graphTitle: cData.gtitle,
      menu: this.state.menu,
      state_menu: this.state.state_menu
    });
  }

  updateMenu(cat, type) {
    if(this.state.view == 'county') {
      if(this.state.county == '') {
        let mData = CountyMapData[type];

        let s = {
          stype: this.state.stype,
          ctype: type,
          view: this.state.view,
          county: this.state.county,
          mapTitle: mData.mtitle,
          graphTitle: this.state.graphTitle,
          menu: this.state.menu,
          state_menu: this.state.state_menu
        };

        s.menu[cat] = type;
        this.setState(s);
      } else {
        let cData = CountyData[this.state.county][type];
        let mData = CountyMapData[type];

        let s = {
          stype: this.state.stype,
          ctype: type,
          view: this.state.view,
          county: this.state.county,
          mapTitle: mData.mtitle,
          graphTitle: cData.gtitle,
          menu: this.state.menu,
          state_menu: this.state.state_menu
        };

        s.menu[cat] = type;
        this.setState(s);
      }
    } else if (this.state.view == 'state') {
      let sData = StateData[type];
      let mData = StateMapData[type];

      let s = {
        stype: type,
        ctype: this.state.ctype,
        view: this.state.view,
        county: this.state.county,
        mapTitle: mData.mtitle,
        graphTitle: sData.gtitle,
        menu: this.state.menu,
        state_menu: this.state.state_menu
      };

      s.state_menu[cat] = type;
      this.setState(s);
    }
  }

  updateView(view) {
    if(view == 'state') {
      let sData = StateData[this.state.stype];
      let mData = StateMapData[this.state.stype];

      let s = {
        stype: this.state.stype,
        ctype: this.state.ctype,
        view: view,
        county: this.state.county,
        mapTitle: mData.mtitle,
        graphTitle: sData.gtitle,
        menu: this.state.menu,
        state_menu: this.state.state_menu
      };

      this.setState(s);
    } else if(view == 'county' && this.state.county != '') {
      let cData = CountyData[this.state.county][this.state.ctype];
      let mData = CountyMapData[this.state.ctype];

      let s = {
        stype: this.state.stype,
        ctype: this.state.ctype,
        view: view,
        county: this.state.county,
        mapTitle: mData.mtitle,
        graphTitle: cData.gtitle,
        menu: this.state.menu,
        state_menu: this.state.state_menu
      };

      this.setState(s);
    } else {
      let mData = CountyMapData[this.state.ctype];

      let s = {
        stype: this.state.stype,
        ctype: this.state.ctype,
        view: view,
        county: this.state.county,
        mapTitle: mData.mtitle,
        graphTitle: "Select a county",
        menu: this.state.menu,
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

  map() {
    if(this.state.view == 'county') {
      return {
        mObj: CountyMapData[this.state.ctype],
        onClick: (obj) => {this.handleMapClick(obj)}
      };
    } else if(this.state.view == 'state') {
      return {
        mObj: StateMapData[this.state.stype],
        onClick: () => {}
      };
    }
  }

  plot() {
    if(this.state.view == 'county') {
      if(this.state.county == '') {
        return {
          type: 'select'
        };
      } else {
        return CountyData[this.state.county][this.state.ctype];
      }
    } else if(this.state.view == 'state') {
      return StateData[this.state.stype];
    }
  }


  render() {
    return (
      <Layout title="TN COVID-19 Data">
        <div className="mt-3 mb-3">
          <Container fluid>
            <Row>
              <Col xl={4}>
                <div className="mb-3">
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
                <div className="ml-3 mr-3">
                  <Row className="justify-content-center">
                    <div style={{width: "100%", height: "100%"}}>
                      <Card>
                        <Card.Header>{this.state.mapTitle}</Card.Header>
                        <Card.Body>
                          <div className="mb-4">
                            <AbstractMap mObj={this.map().mObj} onClick={this.map().onClick}/>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </Row>
                  <div className="mt-5"></div>
                  <Row className="justify-content-center">
                    <div style={{width: "100%", height: "100%"}}>
                      <Card>
                        <Card.Header>{this.state.graphTitle}</Card.Header>
                        <Card.Body>
                          <AbstractPlot pObj={this.plot()} />
                        </Card.Body>
                      </Card>
                    </div>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
          <div className="mt-3">
            <Container fluid>
              <Row className="justify-content-center">
                <span> Source: <a href="https://www.tn.gov/health/cedep/ncov.html"> Tennessee Department of Health</a> </span>
              </Row>
              <Row className="justify-content-center">
                {"Last updated: July 10, 2020"}
              </Row>
            </Container>
          </div>
        </div>
      </Layout>
    )
  }
}

export default TNCovid;
