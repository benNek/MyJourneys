import ReactMapGL from "react-map-gl";
import React, {Fragment, useEffect, useState} from "react";
import mapboxgl from 'mapbox-gl';
import _ from "lodash";


export default function RetrospectiveMap() {
  const defaultOpacity = 0.4;

  const [map, setMap] = useState({});
  const [visitedCountries, setVisitedCountries] = useState([]);
  
  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: 'fullScreenMap',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-74.5, 40],
      zoom: 9
    });

    map.on('load', () => {
      setMap(map);
      loadLayers(map);
      map.on('click', 'countries', e => {
        setVisitedCountries(countries => {
          return handleCountryClick(countries, e);
        })
      });
    });

  }, []);

  useEffect(() => {
    if (Object.entries(map).length === 0 && map.constructor === Object) {
      return;
    }

    const activeCountriesColor = visitedCountries.map(country => [country, 'red']).flat();
    map.setPaintProperty('countries', 'fill-color', [
      'match',
      ['get', 'ADM0_A3_IS'],
      ...activeCountriesColor,
      'transparent'
    ]);

    const activeCountriesOpacity = visitedCountries.map(country => [country, defaultOpacity]).flat();
    map.setPaintProperty('countries', 'fill-opacity', [
      'match',
      ['get', 'ADM0_A3_IS'],
      ...activeCountriesOpacity,
      0
    ]);
  }, [visitedCountries]);

  const addVisitedCountry = (countries, countryCode) => {
    if (_.includes(countries, countryCode)) {
      return countries;
    }

    return [...countries, countryCode];
  };

  const handleCountryClick = (countries, e) => {
    const country = _.find(e.features, ['source', 'countries']);
    if (!country || !country.properties) {
      return countries;
    }
    
    const code = country.properties.ADM0_A3_IS;
    return addVisitedCountry(countries, code);
  };

  const loadLayers = map => {
    map.addLayer({
      'id': 'countries',
      'minzoom': 1,
      'maxzoom': 10,
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
  
  return (
    <Fragment>
      <div id="fullScreenMap"/>
    </Fragment>
  )
}