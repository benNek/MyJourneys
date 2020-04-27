import React, {useContext, useEffect, useState} from 'react';
import './Overview.css';
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import {useHistory} from "react-router";
import {
  getOverviewJourney,
  getOverviewJourneys,
  getTravelingYears,
  getVisitedCountries
} from "../../utils/networkFunctions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import OverviewActions from "./OverviewActions";
import SingleJourneyActions from "./SingleJourneyActions";
import OverviewMap from "./OverviewMap";
import {Context} from "../../state/store";
import PhotoView from "./PhotoView";

const useStyles = makeStyles(theme => ({
  fab: {
    color: theme.palette.text.primary,
    background: theme.palette.background.paper,
    bottom: '42px !important'
  }
}));

export default function Overview() {
  const classes = useStyles();
  const history = useHistory();

  const [state] = useContext(Context);
  const {user} = state;

  const [journeys, setJourneys] = useState([]);

  const [currentJourney, setCurrentJourney] = useState({});
  const [viewMode, setViewMode] = useState('map');

  const [countries, setCountries] = useState([]);
  const [allYears, setAllYears] = useState([]);

  const [listOpen, setListOpen] = useState(false);
  const [year, setYear] = useState(0);

  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    getOverviewJourneys({year}).then(res => setJourneys(res.data)).catch(err => console.error(err));
    getTravelingYears().then(res => {
      if (res.data.length > 1) {
        setAllYears([0, ...res.data]);
      }
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    getOverviewJourneys({year}).then(res => setJourneys(res.data)).catch(err => console.error(err));
    getVisitedCountries({year}).then(res => setCountries(res.data)).catch(err => console.error(err));
  }, [year]);

  const handleOpenPhoto = photo => {
    setPhoto(photo);
    setPhotoModalOpen(true);
  };

  const handleGoBackClick = () => {
    setCurrentJourney({});
    setViewMode('map');
  };

  const handleViewModeChange = (event, mode) => {
    setViewMode(mode);
  };

  const handleTriggerListClick = () => {
    setListOpen(!listOpen);
  };

  const handleYearChange = event => {
    setYear(event.target.value);
  };

  const handleJourneyClick = journeyId => {
    getOverviewJourney(journeyId).then(res => {
      setCurrentJourney(res.data);
      setListOpen(false);
    }).catch(err => console.error(err));
  };

  return (
    <React.Fragment>
      <div className={`map__container ${viewMode === 'gallery' && 'map__container--gallery'}`}>
        <OverviewMap countries={countries} journeys={journeys} viewMode={viewMode}
                     currentJourney={currentJourney} onJourneyClick={handleJourneyClick}
                     onPhotoClick={handleOpenPhoto}/>
        {!!currentJourney.id ?
          <SingleJourneyActions handleGoBackClick={handleGoBackClick} journey={currentJourney} viewMode={viewMode}
                                handleViewModeChange={handleViewModeChange} onPhotoClick={handleOpenPhoto}/>
          :
          <OverviewActions journeys={journeys} year={year} allYears={allYears} isListOpen={listOpen}
                           handleTriggerListClick={handleTriggerListClick} handleJourneyClick={handleJourneyClick}
                           handleYearChange={handleYearChange}/>
        }
      </div>
      <PhotoView open={photoModalOpen} handleClose={() => setPhotoModalOpen(false)} photo={photo}/>
      <Fab onClick={() => history.push('/upload')} aria-label="add photos"
           className={`${classes.fab} FloatingActionButton`}>
        <AddPhotoAlternateIcon/>
      </Fab>
    </React.Fragment>
  )
}