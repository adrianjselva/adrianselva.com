import StateGeoJSON from '../../assets/tn_geojson.json'
import CountyGeoJSON from '../../assets/county_geojson.json'

export function stateMap(mObj, zoom) {
  let hov_temp = '<br>' + mObj.hovtext + ' %{z}<extra></extra>'

  let data = [{
    type: "choroplethmapbox",
    geojson: StateGeoJSON,
    locations: ["Tennessee"],
    z: [mObj.z],
    featureidkey: "properties.NAME",
    colorscale: [
      ['0.0', 'rgb(255, 255, 255)'],
      ['1.0', mObj.col]
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
      zoom: zoom,
      center: {
        lat: 35.8,
        lon: -86
      }
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 2
    },
    autosize: true
  }

  return {
    data: data,
    layout: layout
  }
}

export function countyMap(mObj, zoom) {
  let hov_temp = '<br>' + mObj.hovtext + ' %{z}<extra></extra>'

  let data = [{
    type: "choroplethmapbox",
    geojson: CountyGeoJSON,
    locations: mObj.counties,
    z: mObj.z,
    featureidkey: "properties.NAME",
    colorscale: [
      ['0', mObj.col1],
      ['0.01', mObj.col2],
      ['0.33', mObj.col3],
      ['0.66', mObj.col4],
      ['1.0', mObj.col5]
    ],
    zmin: 0,
    zmax: Math.max(...mObj.z),
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
      zoom: zoom,
      center: {
        lat: 35.8,
        lon: -86
      }
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 2
    },
    autosize: true
  }

  return {
    data: data,
    layout: layout
  }
}
