import React from 'react';
import plotly from 'plotly.js/dist/plotly';
import createPlotComponent from 'react-plotly.js/factory';
import Row from 'react-bootstrap/Row'

const Plot = createPlotComponent(plotly);

import CountyData from '../../assets/county_plots.json'
import StateData from '../../assets/state_plots.json'

import * as plots from './plots.js'

class AbstractPlot extends React.Component {

  constructor(props) {
    super(props)

    let pObj = this.plotObject(StateData["active_cases"])

    this.state = {
      data: pObj.data,
      layout: pObj.layout,
      config: pObj.config
    }
  }

  componentWillReceiveProps(next) {
    if(next.selected.view == "county") {
      if(next.selected.county == '') {
        let selectPlot = this.plotObject({type: 'select'});

        this.setState({
          data: selectPlot.data,
          layout: selectPlot.layout,
          config: selectPlot.config
        });
      } else {
        let countyPlot = this.plotObject(CountyData[next.selected.county][next.selected.county_metric]);

        this.setState({
          data: countyPlot.data,
          layout: countyPlot.layout,
          config: countyPlot.config
        });
      }
    } else if(next.selected.view == "state") {
      let statePlot = this.plotObject(StateData[next.selected.state_metric]);

      this.setState({
        data: statePlot.data,
        layout: statePlot.layout,
        config: statePlot.config
      });
    }
  }

  plotObject(pObj) {
    switch(pObj.type) {
      case "daily":
        return plots.dailyPlot(pObj);
      case "total":
        return plots.totalPlot(pObj);
      case "testing":
        return plots.testPlot(pObj);
      case "select":
        return plots.select();
      case "specimen":
        return plots.dailySpecimenPlot(pObj);
    }
  }

  shouldShowDisclaimer() {
    return(
      (this.props.selected.county_metric == "daily_cases_specimen" &&
       this.props.selected.view == "county" && this.props.selected.county != "")
        ||
      (this.props.selected.state_metric == "daily_cases_specimen" && this.props.selected.view == "state")
    );
  }



  render() {
    let disclaimer = '';

    if(this.shouldShowDisclaimer()) {
      disclaimer = "* Recent dates are incomplete due to lags in reporting. The gray box corresponds to dates that are likely to not yet be reported completely.";
    }

    return(
      <Row>
        <Plot
          data={this.state.data}
          layout={this.state.layout}
          config={this.state.config}
          useResizeHandler={true}
          style={{width: "100%", height: "100%"}}
        />
        <span>{disclaimer}</span>
      </Row>
    );
  }
}

export default AbstractPlot;
