import React, {Fragment, useContext, useEffect, useState} from "react";
import mapboxgl from 'mapbox-gl';
import {Context} from "../../state/store";
import {getMapStyle} from "../../utils/mapUtils";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {getPhotoUrl} from "../../utils/photoUtils";

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

export default function OverviewMap(props) {
  const classes = useStyles();
  const [state] = useContext(Context);
  const {darkMode} = state;

  const {currentJourney, onJourneyClick, viewMode, onPhotoClick} = props;

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
      zoom: 2,
      minZoom: 1.8
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
  }, [darkMode]);

  useEffect(() => {
    setCountries(props.countries);
    setJourneys(props.journeys);
  }, [props]);
  
  useEffect(() => {
    // changing mode from overall view -> single journey view
    updateMap();
  }, [currentJourney]);
  
  useEffect(() => {
    if (currentJourney.id) {
      const coordinates = currentJourney.photos.map(photo => [photo.longitude, photo.latitude]);
      const bounds = coordinates.reduce(function (bounds, coordinate) {
        return bounds.extend(coordinate);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      const desktop = window.innerWidth > 768;
      map.fitBounds(bounds, {
        padding: desktop ? 160 : 60
      });
    }
  }, [currentJourney]);

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
  
  useEffect(() => {
    updateMap(100);
  }, [darkMode]);

  useEffect(() => {
    if (Object.entries(map).length === 0 && map.constructor === Object) {
      return;
    }
    setTimeout(() => {
      map.resize();
      
    }, 100)
  }, [viewMode]);

  const removeMapCountries = () => {
    if (Object.entries(map).length === 0 && map.constructor === Object) {
      return;
    }
    map.setPaintProperty('countries', 'fill-opacity', 0);
  };

  const updateMapCountries = (timeout = 0) => {
    if (Object.entries(map).length === 0 && map.constructor === Object) {
      return;
    }

    if (!countries.length) {
      map.setPaintProperty('countries', 'fill-opacity', 0);
      return;
    }

    const activeCountriesOpacity = countries.map(country => [country, defaultOpacity]).flat();
    
    setTimeout(() => {
      map.setPaintProperty('countries', 'fill-opacity', [
        'match',
        ['get', 'ADM0_A3_IS'],
        ...activeCountriesOpacity,
        0
      ]);
    }, timeout);
  };
  
  const updateMap = timeout => {
    if (currentJourney.id) {
      removeMapCountries();
      removeMapJourneys();
      addPhotoMarkers();
    } else {
      updateMapCountries(timeout);
      updateMapJourneys();
    }
  };

  const removeMapJourneys = () => {
    if (Object.entries(map).length === 0 && map.constructor === Object) {
      return;
    }
    markers.forEach(marker => {
      marker.remove();
    });
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
      const el = renderPhotoCard(journey.id, journey.coverPhoto.path, e => onJourneyClick(e.currentTarget.dataset.id));

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

  const addPhotoMarkers = () => {
    if (Object.entries(map).length === 0 && map.constructor === Object) {
      return;
    }
    markers.forEach(marker => {
      marker.remove();
    });

    const createdMarkers = [];
    currentJourney.photos.forEach(photo => {
      const el = renderPhotoCard(undefined, photo.path, () => onPhotoClick(photo));
      const marker = new mapboxgl.Marker(el)
        .setLngLat([photo.longitude, photo.latitude])
        .addTo(map);
      createdMarkers.push(marker);
    });
    setMarkers(createdMarkers);
  };

  const renderPhotoCard = (id, photo, onClick) => {
    const el = document.createElement('div');
    el.className = classes.coverCard;
    if (id) {
      el.dataset.id = id;
    }
    el.addEventListener('click', onClick);

    const img = document.createElement('img');
    img.setAttribute('src', getPhotoUrl(photo));
    img.setAttribute('alt', '');
    img.className = classes.coverPhoto;
    el.appendChild(img);
    return el;
  };

  return (
    <Fragment>
      <div id="fullScreenMap" className={!!currentJourney.id && viewMode === 'gallery' ? 'map--hidden' : undefined}/>
    </Fragment>
  )
}