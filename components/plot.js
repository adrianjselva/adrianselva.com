import React from 'react';
import plotly from 'plotly.js/dist/plotly';
import createPlotComponent from 'react-plotly.js/factory';

import MapboxToken from '../token.json';

const Plot = createPlotComponent(plotly);

class CovidPlot extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    if(this.props.data == null || this.props.layout == null) {
      return (<p>Select a county</p>);
    } else {
      return (
        <Plot
          onClick={this.props.onClick}
          data={this.props.data}
          layout={Object.assign(this.props.layout, {autosize: true})}
          config={{
            displayModeBar: false,
            displayLogo: false,
            responsive: false,
            mapboxAccessToken: MapboxToken.token
          }}
          useResizeHandler={true}
          style={{width: "100%", height: "100%"}}
        />
      );
    }
  }
}

export default CovidPlot;
