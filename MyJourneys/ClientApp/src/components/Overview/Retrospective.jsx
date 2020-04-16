import React, {useEffect, useState} from 'react';
import './Retrospective.css';
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import {useHistory} from "react-router";
import RetrospectiveMap from "./RetrospectiveMap";
import {getOverviewJourneys, getTravelingYears, getVisitedCountries} from "../../utils/networkFunctions";
import Select from "@material-ui/core/Select";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import OverviewJourneysList from "./OverviewJourneysList";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles(theme => ({
  allJourneysBtn: {
    position: 'absolute',
    left: '8px',
    top: '20px',
    background: theme.palette.background.paper,
    [theme.breakpoints.up('sm')]: {
      left: '20px',
      top: '24px'
    }
  },
  journeysList: {
    position: 'absolute',
    left: '8px',
    top: '68px',
    [theme.breakpoints.up('sm')]: {
      left: '20px',
      top: '82px'
    }
  },
  yearForm: {
    position: 'absolute',
    right: '8px',
    top: '20px',
    [theme.breakpoints.up('sm')]: {
      right: '20px',
      top: '24px'
    }
  },
  yearSelect: {
    height: '36px',
    background: theme.palette.background.paper
  },
  fab: {
    color: theme.palette.text.primary,
    background: theme.palette.background.paper,
    bottom: '42px !important'
  }
}));

export default function Retrospective() {
  const classes = useStyles();
  const history = useHistory();

  const [journeys, setJourneys] = useState([]);
  const [countries, setCountries] = useState([]);
  const [allYears, setAllYears] = useState([]);

  const [listOpen, setListOpen] = useState(false);
  const [year, setYear] = useState(0);

  useEffect(() => {
    getOverviewJourneys({year}).then(res => setJourneys(res.data)).catch(err => console.error(err));
    getTravelingYears().then(res => {
      if (res.data.length > 1) {
        setAllYears([0, ...res.data]);
      }
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    getOverviewJourneys({year}).then(res => setJourneys(res.data)).catch(err => console.error(err));
    getVisitedCountries({year}).then(res => setCountries(res.data)).catch(err => console.error(err));
  }, [year]);

  const handleTriggerListClick = () => {
    setListOpen(!listOpen);
  };

  const handleYearChange = event => {
    setYear(event.target.value);
  };

  const renderYears = () => {
    if (!allYears.length) {
      return;
    }

    return allYears.map(year => (
      <option key={year} value={year}>{year === 0 ? "All" : year}</option>
    ));
  };

  return (
    <React.Fragment>
      <div className="map__container">
        <RetrospectiveMap countries={countries} journeys={journeys}/>
        {journeys.length > 0 &&
        <Button onClick={handleTriggerListClick} className={classes.allJourneysBtn} variant="outlined">
          {listOpen ? "Close" : "Open"} list
        </Button>
        }
        {listOpen && <Fade in={listOpen}>
          <div className={classes.journeysList}><OverviewJourneysList journeys={journeys}/></div>
        </Fade>}
        {allYears.length > 0 &&
        <FormControl variant="outlined" className={classes.yearForm}>
          <Select
            native
            className={classes.yearSelect}
            value={year}
            onChange={handleYearChange}
            inputProps={{
              name: 'year',
            }}
          >
            {renderYears()}
          </Select>
        </FormControl>
        }
      </div>
      <Fab onClick={() => history.push('/upload')} aria-label="add photos"
           className={`${classes.fab} FloatingActionButton`}>
        <AddPhotoAlternateIcon/>
      </Fab>
    </React.Fragment>
  )
}