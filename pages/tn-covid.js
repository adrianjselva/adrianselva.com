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

import CountyData from '../assets/counties.json'

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
      type: 'total_cases',
      county: '',
      data: null,
      layout: null
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
      layout: gObj.layout
    })
  }

  updateCounty(county) {
    console.log(this.state)
    let cData = CountyData[county][this.state.type];

    let gObj = this.plotObject(cData);

    this.setState({
      type: this.state.type,
      county: county,
      data: gObj.data,
      layout: gObj.layout
    });
  }

  countySelectorTitle() {
    if(this.state.county == '') {
      return "Select a county"
    } else {
      return this.state.county;
    }
  }


  render() {
    return (
      <Layout title="TN COVID-19 Data">
        <div className="mt-5 mb-5">
        <Container fluid>
          <Row>
            <Col md="auto">
            <Tab.Container id="graph-selection" defaultActiveKey="total_cases">
              <ListGroup>
                <ListGroup.Item action onClick={() => this.changePlots("total_cases")} eventKey="total_cases">Total Cases</ListGroup.Item>
                <ListGroup.Item action onClick={() => this.changePlots("daily_cases")} eventKey="daily_cases">Daily Cases</ListGroup.Item>
                <ListGroup.Item action onClick={() => this.changePlots("total_deaths")} eventKey="total_deaths">Total Deaths</ListGroup.Item>
                <ListGroup.Item action onClick={() => this.changePlots("daily_deaths")} eventKey="daily_deaths">Daily Deaths</ListGroup.Item>
                <ListGroup.Item action eventKey="testing">Testing Data</ListGroup.Item>
                <ListGroup.Item action onClick={() => this.changePlots("active_cases")} eventKey="active_cases">Active Cases</ListGroup.Item>
                <ListGroup.Item action onClick={() => this.changePlots("daily_active")} eventKey="daily_active">Daily Active Cases</ListGroup.Item>
                <ListGroup.Item action onClick={() => this.changePlots("total_recoveries")} eventKey="total_recoveries">Total Recoveries</ListGroup.Item>
                <ListGroup.Item action onClick={() => this.changePlots("daily_recoveries")} eventKey="daily_recoveries">Daily Recoveries</ListGroup.Item>
                <ListGroup.Item action onClick={() => this.changePlots("total_hospitalized")} eventKey="total_hospitalized">Total Hospitalized</ListGroup.Item>
                <ListGroup.Item action onClick={() => this.changePlots("daily_hospitalized")} eventKey="daily_hospitalized">Daily Hospitalized</ListGroup.Item>
              </ListGroup>
              </Tab.Container>
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
          </Col>
          </Row>
        </Container>
        </div>
      </Layout>
    )
  }
}

export default TNCovid;
