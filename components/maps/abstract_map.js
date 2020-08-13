import React from 'react';
import plotly from 'plotly.js/dist/plotly';
import createPlotComponent from 'react-plotly.js/factory';

import StateMapData from '../../assets/state_maps.json'
import CountyMapData from '../../assets/county_maps.json'

import MapboxToken from '../../token.json';

const Map = createPlotComponent(plotly);

import * as maps from './maps.js'

class AbstractMap extends React.Component {

  constructor(props) {
    super(props)

    let mapObject = this.mapObject(StateMapData["active_cases"]);

    this.state = {
      data: mapObject.data,
      layout: mapObject.layout
    }
  }

  componentWillReceiveProps(next) {
    if(next.selected.view == 'county') {
      let mapObject = this.mapObject(CountyMapData[next.selected.county_metric]);

      this.setState({
        data: mapObject.data,
        layout: mapObject.layout
      });
    } else if(next.selected.view == 'state') {
      let mapObject = this.mapObject(StateMapData[next.selected.state_metric]);

      this.setState({
        data: mapObject.data,
        layout: mapObject.layout
      });
    }
  }

  mapObject(mObj) {
    switch(mObj.type) {
      case "smap":
        return maps.stateMap(mObj, this.props.zoom);
      case "cmap":
        return maps.countyMap(mObj, this.props.zoom);
    }
  }

  render() {
    return(
      <Map
        data={this.state.data}
        layout={this.state.layout}
        config={{
          displayLogo: false,
          responsive: false,
          displayModeBar: false,
          mapboxAccessToken: MapboxToken.token,
        }}
        useResizeHandler={true}
        style={{width: "100%", height: "100%"}}
        onClick={this.props.onClick}
      />
    );
  }
}

export default AbstractMap;
