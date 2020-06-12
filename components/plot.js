import React from 'react';
import plotly from 'plotly.js/dist/plotly';
import createPlotComponent from 'react-plotly.js/factory';

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
          layout={this.props.layout}
          config={{
            displayModeBar: false,
            displayLogo: false,
            responsive: false,
            mapboxAccessToken: 'pk.eyJ1IjoiYWRyaWFuanNlbHZhIiwiYSI6ImNrYXNtZzBjMzBmdjcyc3Bid2JlNmhlNHYifQ.zYAzrN8cBkRmBVmvt6v5bg'
          }}
        />
      );
    }
  }
}

export default CovidPlot;
