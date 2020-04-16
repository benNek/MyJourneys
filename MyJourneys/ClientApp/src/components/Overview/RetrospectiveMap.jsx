import React, {Fragment, useContext, useEffect, useState} from "react";
import mapboxgl from 'mapbox-gl';
import {Context} from "../../state/store";

export default function RetrospectiveMap(props) {
  const defaultOpacity = 0.4;

  const [state] = useContext(Context);
  const {darkMode} = state;

  const [map, setMap] = useState({});
  const [visitedCountries, setVisitedCountries] = useState(props.countries);

  const getMapStyle = () => {
    return darkMode ? "mapbox://styles/bennek/ck91w6y191la41kpmgetqg8ce" : "mapbox://styles/bennek/ck91vtkwy02bu1ioifdod49tt";
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: 'fullScreenMap',
      style: getMapStyle(),
      center: [0, 30],
      zoom: 2
    });

    map.on('load', () => {
      setMap(map);
    });
  }, []);

  useEffect(() => {
    if (Object.entries(map).length === 0 && map.constructor === Object) {
      return;
    }
    map.setStyle(getMapStyle());
    // TODO should update visited countries
  }, [darkMode]);

  useEffect(() => {
    setVisitedCountries(props.countries);
  }, [props]);

  useEffect(() => {
    updateMapCountries();
  }, [map]);

  useEffect(() => {
    updateMapCountries();
  }, [visitedCountries]);

  const updateMapCountries = () => {
    if (Object.entries(map).length === 0 && map.constructor === Object) {
      return;
    }

    if (!visitedCountries.length) {
      return;
    }

    const activeCountriesOpacity = visitedCountries.map(country => [country, defaultOpacity]).flat();
    map.setPaintProperty('countries', 'fill-opacity', [
      'match',
      ['get', 'ADM0_A3_IS'],
      ...activeCountriesOpacity,
      0
    ]);
  };

  return (
    <Fragment>
      <div id="fullScreenMap"/>
    </Fragment>
  )
}