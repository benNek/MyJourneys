import React, {Fragment, useEffect, useState} from "react";
import mapboxgl from 'mapbox-gl';

export default function RetrospectiveMap(props) {
  const defaultOpacity = 0.4;

  const [map, setMap] = useState({});
  const [visitedCountries, setVisitedCountries] = useState(props.countries);
  
  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: 'fullScreenMap',
      style: 'mapbox://styles/bennek/ck91vtkwy02bu1ioifdod49tt',
      center: [0, 30],
      zoom: 2
    });

    map.on('load', () => {
      setMap(map);
    });

  }, []);
  
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