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

const useStyles = makeStyles(theme => ({
  yearForm: {
    position: 'absolute',
    right: '24px',
    top: '24px'
  },
  yearSelect: {
    height: '36px',
    background: theme.palette.background.paper
  }
}));

export default function Retrospective() {
  const classes = useStyles();
  const history = useHistory();

  const [journeys, setJourneys] = useState([]);
  const [countries, setCountries] = useState([]);
  const [allYears, setAllYears] = useState([]);
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
      <Fab onClick={() => history.push('/upload')} aria-label="add photos" className="FloatingActionButton">
        <AddPhotoAlternateIcon/>
      </Fab>
    </React.Fragment>
  )
}