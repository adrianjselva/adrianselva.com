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
import Alert from 'react-bootstrap/Alert'
import Accordion from 'react-bootstrap/Accordion'

import Titles from '../assets/titles.json'

import DateString from '../assets/date.json'

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
      state_data: 'active',
      county_data: 'active',
      view: 'state',
      county: '',
      title: Titles.state.active,
      county_menu: {
        metrics: 'active',
        demographic: 'school_age'
      },
      state_menu: {
        metrics: 'active',
      },
      zoom: 6
    };
  }

  componentDidMount() {
    let zoom;

    if(window.innerWidth < 1200) {
      zoom = this.zoomLevelSmall(window.innerWidth);
    } else {
      zoom = this.zoomLevelBig(window.innerWidth);
    }

    this.setState({
      state_data: this.state.state_data,
      county_data: this.state.county_data,
      view: this.state.view,
      county: this.state.county,
      title: this.state.title,
      county_menu: this.state.county_menu,
      state_menu: this.state.state_menu,
      zoom: zoom
    });
  }

  zoomLevelSmall(w) {
    let squareCoefficient = (parseFloat("0.0000034470") * -1);
    let firstDegCoefficient = parseFloat("0.0076156061");
    let intercept = parseFloat("2.0565757576");

    return((squareCoefficient * (w * w)) +
           (firstDegCoefficient * w) +
           intercept);
  }

  zoomLevelBig(w) {
    let squareCoefficient = (parseFloat("0.0000002669") * -1);
    let firstDegCoefficient = parseFloat("0.0018410956");
    let intercept = parseFloat("4.0390769231");

    return((squareCoefficient * (w * w)) +
           (firstDegCoefficient * w) +
           intercept);
  }

  updateCounty(county) {
    this.setState({
      state_data: this.state.state_data,
      county_data: this.state.county_data,
      view: this.state.view,
      county: county,
      title: Titles.county[county][this.state.county_data],
      county_menu: this.state.county_menu,
      state_menu: this.state.state_menu,
      zoom: this.state.zoom
    });
  }

  updateMenu(menu, data) {
    if(this.state.view == 'county') {
      if(this.state.county == '') {
        let s = {
          state_data: this.state.state_data,
          county_data: data,
          view: this.state.view,
          county: this.state.county,
          title: "Select a county",
          county_menu: this.state.county_menu,
          state_menu: this.state.state_menu,
          zoom: this.state.zoom
        };

        s.county_menu[menu] = data;
        this.setState(s);
      } else {

        let s = {
          state_data: this.state.state_data,
          county_data: data,
          view: this.state.view,
          county: this.state.county,
          title: Titles.county[this.state.county][data],
          county_menu: this.state.county_menu,
          state_menu: this.state.state_menu,
          zoom: this.state.zoom
        };

        s.county_menu[menu] = data;
        this.setState(s);
      }
    } else if (this.state.view == 'state') {
      let s = {
        state_data: data,
        county_data: this.state.county_data,
        view: this.state.view,
        county: this.state.county,
        title: Titles.state[data],
        county_menu: this.state.county_menu,
        state_menu: this.state.state_menu,
        zoom: this.state.zoom
      };

      s.state_menu[menu] = data;
      this.setState(s);
    }
  }

  updateView(view) {
    if(view == 'state') {
      let s = {
        state_data: this.state.state_data,
        county_data: this.state.county_data,
        view: view,
        county: this.state.county,
        title: Titles.state[this.state.state_data],
        county_menu: this.state.county_menu,
        state_menu: this.state.state_menu,
        zoom: this.state.zoom
      };

      this.setState(s);
    } else if(view == 'county' && this.state.county != '') {
      let s = {
        state_data: this.state.state_data,
        county_data: this.state.county_data,
        view: view,
        county: this.state.county,
        title: Titles.county[this.state.county][this.state.county_data],
        county_menu: this.state.county_menu,
        state_menu: this.state.state_menu,
        zoom: this.state.zoom
      };

      this.setState(s);
    } else {
      let s = {
        state_data: this.state.state_data,
        county_data: this.state.county_data,
        view: view,
        county: this.state.county,
        title: "Select a county",
        county_menu: this.state.county_menu,
        state_menu: this.state.state_menu,
        zoom: this.state.zoom
      };

      this.setState(s);
    }
  }

  handleMapClick(obj) {
    if(this.state.view == 'county') {
      this.updateCounty(obj.points[0].properties.NAME);
    }
  }

  selected() {
    return({
      county: this.state.county,
      state_data: this.state.state_data,
      county_data:  this.state.county_data,
      view: this.state.view
    })
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
                        <Tabs defaultActiveKey="metrics" id="state_data_category" variant='pills'>
                          <Tab eventKey="metrics" title="Metrics">
                            <div className="mt-2">
                              <Tab.Container id="state_metric_list" defaultActiveKey="active">
                                <ListGroup onSelect={(key, evnt) => {this.updateMenu("metrics", key)}}>
                                  <ListGroup.Item action eventKey="active">Active Cases</ListGroup.Item>
                                  <ListGroup.Item action eventKey="cases">Case Counts</ListGroup.Item>
                                  <ListGroup.Item action eventKey="cases_specimen">Case Counts (Specimen Collection Date)</ListGroup.Item>
                                  <ListGroup.Item action eventKey="deaths">Deaths</ListGroup.Item>
                                  <ListGroup.Item action eventKey="hospitalizations">Hospitalizations</ListGroup.Item>
                                  <ListGroup.Item action eventKey="recovered">Recovered Cases</ListGroup.Item>
                                  <ListGroup.Item action eventKey="testing">Testing</ListGroup.Item>
                                </ListGroup>
                              </Tab.Container>
                            </div>
                          </Tab>
                        </Tabs>
                      </div>
                    </Tab>
                    <Tab eventKey="county" title="County Data">
                      <div className="mt-2">
                        <Tabs onSelect={(key, evnt) => {this.updateMenu(key, this.state.county_menu[key])}} defaultActiveKey="metrics" id="county_data_category" variant='pills'>
                          <Tab eventKey="metrics" title="Metrics">
                            <div className="mt-2">
                              <Tab.Container id="county_metric_list" defaultActiveKey="active">
                                <ListGroup onSelect={(key, evnt) => {this.updateMenu("metrics", key)}}>
                                  <ListGroup.Item action eventKey="active">Active Cases</ListGroup.Item>
                                  <ListGroup.Item action eventKey="cases">Case Counts</ListGroup.Item>
                                  <ListGroup.Item action eventKey="cases_specimen">Case Counts (Specimen Collection Date)</ListGroup.Item>
                                  <ListGroup.Item action eventKey="deaths">Deaths</ListGroup.Item>
                                  <ListGroup.Item action eventKey="hospitalizations">Hospitalizations</ListGroup.Item>
                                  <ListGroup.Item action eventKey="recovered">Recovered Cases</ListGroup.Item>
                                  <ListGroup.Item action eventKey="testing">Testing</ListGroup.Item>
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
                <Alert variant={'info'}>
                  Hover text may persist between plot and map changes
                </Alert>
                <div className="ml-3 mr-3">
                  <Row className="justify-content-center">
                    <div style={{width: "100%", height: "100%"}}>
                      <Card>
                        <Card.Header>Map</Card.Header>
                        <Card.Body>
                          <div className="mb-4">
                            <AbstractMap selected={this.selected()} onClick={(obj) => this.handleMapClick(obj)} zoom={this.state.zoom}/>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </Row>
                  <div className="mt-5"></div>
                  <Row className="justify-content-center">
                    <div style={{width: "100%", height: "100%"}}>
                      <Card>
                        <Card.Header>{this.state.title}</Card.Header>
                        <Card.Body>
                          <AbstractPlot selected={this.selected()} />
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
                <span>Source: <a href="https://www.tn.gov/health/cedep/ncov.html">Tennessee Department of Health</a></span>
              </Row>
              <Row className="justify-content-center">
                {"Last updated: " + DateString['date']}
              </Row>
            </Container>
          </div>
        </div>
      </Layout>
    )
  }
}

export default TNCovid;
