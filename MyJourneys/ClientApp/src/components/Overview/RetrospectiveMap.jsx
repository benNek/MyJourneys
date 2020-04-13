import React, {useEffect, useState} from "react";
import _ from "lodash";
import ReactMapGL from "react-map-gl";

export default function RetrospectiveMap(props) {
  const defaultOpacity = 0.4;

  const [lat, setLat] = useState(...props.lat);
  const [lon, setLon] = useState(...props.lon);

  useEffect(() => {
    setLat(props.lat);
    setLon(props.lon);
    viewport.latitude = props.lat;
    viewport.longitude = props.lon;
    setViewport(viewport);
  }, [props.lat, props.lon]);

  const [viewport, setViewport] = useState({
    width: "60%",
    height: "100%",
    latitude: lat || 42.361145,
    longitude: lon || -71.057083,
    zoom: 8
  });

  const [visitedCountries, setVisitedCountries] = useState([]);
  const [map, setMap] = useState({});

  const addVisitedCountry = (countryCode) => {
    if (_.includes(visitedCountries, countryCode)) {
      return;
    }
    setVisitedCountries([
      ...visitedCountries, countryCode
    ]);
  };

  useEffect(() => {
    if (Object.entries(map).length === 0 && map.constructor === Object) {
      return;
    }

    const activeCountries = visitedCountries.map(country => {
      return [country, defaultOpacity];
    }).flat();
    map.setPaintProperty('countries', 'fill-opacity', [
      'match',
      ['get', 'ADM0_A3_IS'],
      ...activeCountries,
      0
    ]);
  }, [visitedCountries]);

  const loadLayers = (map) => {
    setMap(map.target);
    map.target.addLayer({
      'id': 'countries',
      'source': {
        'type': 'vector',
        'url': 'mapbox://byfrost-articles.74qv0xp0'
      },
      'source-layer': 'ne_10m_admin_0_countries-76t9ly',
      'type': 'fill',
      'paint': {
        'fill-color': '#fbb03b',
        'fill-outline-color': '#F2F2F2',
        'fill-opacity': 0
      }
    });
  };

  const clickCountry = (area) => {
    const country = _.find(area.features, ['source', 'countries']);
    if (!country || !country.properties) {
      return;
    }

    const code = country.properties.ADM0_A3_IS;
    addVisitedCountry(code);
  };

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={(viewport) => setViewport(viewport)}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onLoad={loadLayers}
      onClick={clickCountry}
    />
  );
}