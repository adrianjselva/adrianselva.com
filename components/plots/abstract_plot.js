import React from 'react';
import plotly from 'plotly.js/dist/plotly';
import createPlotComponent from 'react-plotly.js/factory';

const Plot = createPlotComponent(plotly);

class AbstractPlot extends React.Component {

  constructor(props) {
    super(props)
  }

  plotObject(pObj) {
    switch(this.props.pObj.type) {
      case "daily":
        return this.dailyPlot(this.props.pObj);
      case "total":
        return this.totalPlot(this.props.pObj);
      case "testing":
        return this.testPlot(this.props.pObj);
      case "select":
        return this.select();
    }
  }

  dailyPlot(pObj) {
    let data = [{
      x: pObj.xval,
      y: pObj.yval,
      type: 'bar',
      mode: 'lines+markers',
      marker: {
        color: pObj.barcolor
      },
      hoverinfo: 'x+y'
    },
    {
      x: pObj.xval,
      y: pObj.movingAverage,
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      fillcolor: pObj.fillcolor,
      line: {
        color: pObj.movingLineColor
      },
      hoverinfo: 'skip'
    }
  ];

    let layout = {
      xaxis: {
        title: "Date",
      },
      yaxis: {
        title: pObj.ytitle,
      },
      showlegend: false,
      margin: {
        l: 60,
        r: 2,
        t: 25,
        pad: 2
      },
      autosize: true
    };

    return {
      data: data,
      layout: layout,
      config: {
        displayLogo: false,
        responsive: false,
        toImageButtonOptions: {
          format: 'png',
          filename: 'plot',
          height: 900,
          width: 1500,
          scale: 2
        },
      }
    }
  }

  totalPlot(pObj) {
    let data = [{
      x: pObj.xval,
      y: pObj.yval,
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        color: pObj.linecolor
      }
    }];

    let layout = {
      xaxis: {
        title: "Date",
      },
      yaxis: {
        title: pObj.ytitle,
      },
      margin: {
        r: 2,
        l: 60,
        t: 25,
        pad: 2
      },
      autosize: true
    };

    return {
      data: data,
      layout: layout,
      config: {
        displayLogo: false,
        responsive: false,
        toImageButtonOptions: {
          format: 'png',
          filename: 'plot',
          height: 900,
          width: 1500,
          scale: 2
        },
      }
    }
  }

  testPlot(pObj) {
    let data = [{
      x: pObj.xval,
      y: pObj.totalTestVal,
      type: 'bar',
      name: 'Total Tests',
      hoverinfo: 'x+y',
      marker: {
        color: 'rgb(206, 162, 219)'
      }
    },
    {
      x: pObj.xval,
      y: pObj.positiveVals,
      type: 'bar',
      name: 'Positive Tests',
      hoverinfo: 'x+y',
      marker: {
        color: 'rgb(0, 182, 199)'
      }
    },
    {
      x: pObj.xval,
      y: pObj.percentPositive,
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
      },
      yaxis: {
        title: 'Daily Tests',
      },
      yaxis2: {
        overlaying: "y",
        side: "right",
        title: "Positive (%)",
        rangemode: 'tozero',
        showgrid: false
      },
      barmode: 'overlay',
      legend: {
        y: -.3,
        orientation: 'h'
      },
      margin: {
        b: 0,
        t: 25,
        r: 45,
        l: 60,
        pad: 2
      },
      autosize: true
    }

    return {
      data: data,
      layout: layout,
      config: {
        displayLogo: false,
        responsive: false,
        toImageButtonOptions: {
          format: 'png',
          filename: 'plot',
          height: 900,
          width: 1500,
          scale: 2
        },
      }
    }

  }

  select() {
    return {
      data: [{
        x: [0.5],
        y: [0.5],
        mode: 'text',
        type: 'scatter',
        hoverinfo: 'skip'
      }],
      layout: {
        xaxis: {
          showgrid: false,
          zeroline: false,
          visible: false
        },
        yaxis: {
          showgrid: false,
          zeroline: false,
          visible: false
        },
        annotations: [{
          showarrow: false,
          text: "Select a county",
          x: 0.5,
          y: 0.5,
          font: {
            size: 30
          }
        }]
      },
      config: {
        displaymodebar: false,
        displayLogo: false,
        responsive: false,
        staticPlot: true
      }
    }
  }



  render() {
    let pObj = this.plotObject(this.props.pObj);

    return(
      <Plot
        data={pObj.data}
        layout={pObj.layout}
        config={pObj.config}
        useResizeHandler={true}
        style={{width: "100%", height: "100%"}}
      />
    );
  }
}

export default AbstractPlot;
