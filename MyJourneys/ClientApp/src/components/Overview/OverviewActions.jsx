import React, {Fragment} from "react";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import OverviewJourneysList from "./OverviewJourneysList";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import makeStyles from "@material-ui/core/styles/makeStyles";

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
  }
}));

export default function OverviewActions(props) {
  const classes = useStyles();
  const {journeys, year, allYears, isListOpen, handleTriggerListClick, handleJourneyClick, handleYearChange} = props;

  const renderYears = () => {
    if (!allYears.length) {
      return;
    }

    return allYears.map(year => (
      <option key={year} value={year}>{year === 0 ? "All" : year}</option>
    ));
  };
  
  return (
    <Fragment>
      {journeys.length > 0 &&
      <Button onClick={handleTriggerListClick} className={classes.allJourneysBtn} variant="outlined">
        {isListOpen ? "Close" : "Open"} list
      </Button>
      }
      {isListOpen && <Fade in={isListOpen}>
        <div className={classes.journeysList}>
          <OverviewJourneysList journeys={journeys} onClick={handleJourneyClick}/>
        </div>
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
            'aria-label': 'travel year filter'
          }}
        >
          {renderYears()}
        </Select>
      </FormControl>
      }
    </Fragment>
  )
}