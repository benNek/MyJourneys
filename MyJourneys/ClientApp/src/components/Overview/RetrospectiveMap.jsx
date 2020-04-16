import React, {Fragment, useContext, useEffect, useState} from "react";
import mapboxgl from 'mapbox-gl';
import {Context} from "../../state/store";
import {getMapStyle} from "../../utils/mapUtils";

export default function RetrospectiveMap(props) {
  const [state] = useContext(Context);
  const {darkMode} = state;

  const defaultOpacity = darkMode ? .2 : .4;
  
  const [map, setMap] = useState({});
  const [visitedCountries, setVisitedCountries] = useState(props.countries);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: 'fullScreenMap',
      style: getMapStyle(darkMode),
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
    map.setStyle(getMapStyle(darkMode));
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
      map.setPaintProperty('countries', 'fill-opacity', 0);
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