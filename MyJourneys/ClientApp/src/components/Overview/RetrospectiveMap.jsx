import React, {useContext, useEffect, useState} from "react";
import mapboxgl from 'mapbox-gl';
import {Context} from "../../state/store";
import {getMapStyle, getPhotoUrl} from "../../utils/mapUtils";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  coverCard: {
    width: '75px',
    background: theme.palette.background.default,
    boxShadow: theme.shadows[1],
    transition: 'background .2s',
    cursor: 'pointer',
    "&:hover": {
      background: theme.palette.background.paper
    }
  },
  coverPhoto: {
    height: '50px',
    width: '100%',
    objectFit: 'cover'
  },
  coverTitle: {
    margin: 0,
    textAlign: 'center'
  }
}));

export default function RetrospectiveMap(props) {
  const classes = useStyles();
  const [state] = useContext(Context);
  const {darkMode} = state;

  const defaultOpacity = darkMode ? .2 : .4;

  const [map, setMap] = useState({});
  const [journeys, setJourneys] = useState(props.journeys);
  const [countries, setCountries] = useState(props.countries);
  const [markers, setMarkers] = useState([]);

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
    setCountries(props.countries);
    setJourneys(props.journeys);
  }, [props]);

  useEffect(() => {
    updateMapCountries();
    updateMapJourneys();
  }, [map]);

  useEffect(() => {
    updateMapCountries();
  }, [countries]);

  useEffect(() => {
    updateMapJourneys();
  }, [journeys]);

  const updateMapCountries = () => {
    if (Object.entries(map).length === 0 && map.constructor === Object) {
      return;
    }

    if (!countries.length) {
      map.setPaintProperty('countries', 'fill-opacity', 0);
      return;
    }

    const activeCountriesOpacity = countries.map(country => [country, defaultOpacity]).flat();
    map.setPaintProperty('countries', 'fill-opacity', [
      'match',
      ['get', 'ADM0_A3_IS'],
      ...activeCountriesOpacity,
      0
    ]);
  };

  const updateMapJourneys = () => {
    if (Object.entries(map).length === 0 && map.constructor === Object) {
      return;
    }
    markers.forEach(marker => {
      marker.remove();
    });

    const createdMarkers = [];
    journeys.forEach(journey => {
      const el = document.createElement('div');
      el.className = classes.coverCard;
      
      const img = document.createElement('img');
      img.setAttribute('src', getPhotoUrl(journey.coverPhoto.path));
      img.className = classes.coverPhoto;
      el.appendChild(img);
      
      const heading = document.createElement('p');
      heading.className = classes.coverTitle;
      heading.innerText = journey.title;
      el.appendChild(heading);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([journey.coverPhoto.longitude, journey.coverPhoto.latitude])
        .addTo(map);
      createdMarkers.push(marker);
    });
    setMarkers(createdMarkers);
  };

  return (
    <div id="fullScreenMap"/>
  )
}