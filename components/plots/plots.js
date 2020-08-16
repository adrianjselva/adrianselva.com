export function dailyTotalPlot(pObj) {
  let data = [
    {
      x: pObj.daily.xval,
      y: pObj.daily.yval,
      type: 'bar',
      mode: 'lines+markers',
      marker: {
        color: pObj.daily.barcolor
      },
      hoverinfo: 'x+y',
      visible: true,
    },
    {
      x: pObj.daily.xval,
      y: pObj.daily.movingAverage,
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      fillcolor: pObj.daily.fillcolor,
      line: {
        color: pObj.daily.movingLineColor
      },
      hoverinfo: 'skip',
      visible: true,
    },
    {
      x: pObj.total.xval,
      y: pObj.total.yval,
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        color: pObj.total.linecolor
      },
      hoverinfo: 'x+y',
      visible: false,
    }];

  let updatemenus = [
    {
      buttons: [
        {
          args: [{'visible': [true, true, false]}],
          label: 'Daily',
          method: 'update'
        },
        {
          args: [{'visible': [false, false, true]}],
          label: 'Total',
          method: 'update'
        }
      ],
      direction: 'left',
      showactive: 'true',
      type: 'buttons',
      x: 0.5,
      y: 1.2
    }
  ];

  let layout = {
    updatemenus: updatemenus,
    xaxis: {
      title: pObj.xtitle,
    },
    showlegend: false,
    margin: {
      l: 35,
      r: 0,
      t: 35,
      pad: 2
    },
    autosize: true,
    dragmode: 'pan',
    shapes: pObj.shapes
  };

  return {
    data: data,
    layout: layout,
    config: {
      displaylogo: false,
      responsive: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'plot',
        scale: 2
      },
      modeBarButtonsToRemove: [
        'hoverClosestCartesian',
        'hoverCompareCartesian',
        'select2d',
        'pan2d',
        'lasso2d',
        'autoScale2d',
        'toggleSpikelines',
        'zoom2d',
        'resetScale2d'
      ]
    }
  };
}

export function totalDailyPlot(pObj) {
  let data = [
    {
      x: pObj.total.xval,
      y: pObj.total.yval,
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        color: pObj.total.linecolor
      },
      hoverinfo: 'x+y',
      visible: true,
    },
    {
      x: pObj.daily.xval,
      y: pObj.daily.yval,
      type: 'bar',
      mode: 'lines+markers',
      marker: {
        color: pObj.daily.barcolor
      },
      hoverinfo: 'x+y',
      visible: false,
    },
    {
      x: pObj.daily.xval,
      y: pObj.daily.movingAverage,
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      fillcolor: pObj.daily.fillcolor,
      line: {
        color: pObj.daily.movingLineColor
      },
      hoverinfo: 'skip',
      visible: false,
    },];

  let updatemenus = [
    {
      buttons: [
        {
          args: [{'visible': [true, false, false]}],
          label: 'Active',
          method: 'update'
        },
        {
          args: [{'visible': [false, true, true]}],
          label: 'Daily',
          method: 'update'
        }
      ],
      direction: 'left',
      showactive: 'true',
      type: 'buttons',
      x: 0.5,
      y: 1.2
    }
  ];

  let layout = {
    updatemenus: updatemenus,
    xaxis: {
      title: pObj.xtitle,
    },
    showlegend: false,
    margin: {
      l: 35,
      r: 0,
      t: 35,
      pad: 2
    },
    autosize: true,
    dragmode: 'pan',
    shapes: pObj.shapes
  };

  return {
    data: data,
    layout: layout,
    config: {
      displaylogo: false,
      responsive: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'plot',
        scale: 2
      },
      modeBarButtonsToRemove: [
        'hoverClosestCartesian',
        'hoverCompareCartesian',
        'select2d',
        'pan2d',
        'lasso2d',
        'autoScale2d',
        'toggleSpikelines',
        'zoom2d',
        'resetScale2d'
      ]
    }
  };
}

export function dailySpecimenPlot(pObj) {
  let fourteenDayBegin = pObj.xval[(pObj.xval.length - 10)];
  let fourteenDayEnd = pObj.xval[(pObj.xval.length - 1)];
  let recHeight = Math.max(...pObj.yval);

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
      title: "Specimen Collection Date",
    },
    showlegend: false,
    margin: {
      l: 60,
      r: 2,
      t: 25,
      pad: 2
    },
    autosize: true,
    dragmode: 'pan',
    shapes: [
      {
        type: 'rect',
        xref: 'x',
        yref: 'y',
        x0: fourteenDayBegin,
        y0: 0,
        x1: fourteenDayEnd,
        y1: recHeight,
        line: {
          color: 'rgba(0, 0, 0, 0)'
        },
        fillcolor: 'rgba(156, 156, 156, 0.3)'
      }
    ]
  };

  return {
    data: data,
    layout: layout,
    config: {
      displaylogo: false,
      responsive: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'specimen_plot',
        scale: 2
      },
      modeBarButtonsToRemove: [
        'hoverClosestCartesian',
        'hoverCompareCartesian',
        'select2d',
        'lasso2d',
        'autoScale2d'
      ]
    }
  }
}

export function dailyPlot(pObj) {
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
    autosize: true,
    dragmode: 'pan'
  };

  return {
    data: data,
    layout: layout,
    config: {
      displaylogo: false,
      responsive: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'daily_plot',
        scale: 2
      },
      modeBarButtonsToRemove: [
        'hoverClosestCartesian',
        'hoverCompareCartesian',
        'select2d',
        'lasso2d',
        'autoScale2d'
      ]
    }
  }
}

export function totalPlot(pObj) {
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
    autosize: true,
    dragmode: 'pan'
  };

  return {
    data: data,
    layout: layout,
    config: {
      displaylogo: false,
      responsive: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'total_plot',
        scale: 2
      },
      modeBarButtonsToRemove: [
        'hoverClosestCartesian',
        'hoverCompareCartesian',
        'select2d',
        'lasso2d',
        'autoScale2d'
      ]
    }
  }
}

export function testPlot(pObj) {
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
    name: 'Percent Positive (7-day Average)',
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
    autosize: true,
    dragmode: 'pan'
  }

  return {
    data: data,
    layout: layout,
    config: {
      displaylogo: false,
      responsive: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'testing_plot',
        scale: 2
      },
      modeBarButtonsToRemove: [
        'hoverClosestCartesian',
        'hoverCompareCartesian',
        'select2d',
        'lasso2d',
        'autoScale2d'
      ]
    }
  }

}

export function select() {
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
      displaylogo: false,
      responsive: false,
      staticPlot: true
    }
  }
}
