import React, {Fragment} from "react";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MapIcon from '@material-ui/icons/Map';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";

const useStyles = makeStyles(theme => ({
  goBackBtn: {
    position: 'absolute',
    left: '8px',
    top: '20px',
    background: theme.palette.background.paper,
    [theme.breakpoints.up('sm')]: {
      left: '20px',
      top: '24px'
    }
  },
  viewModeContainer: {
    position: 'absolute',
    right: '8px',
    top: '20px',
    [theme.breakpoints.up('sm')]: {
      right: '20px',
      top: '24px'
    }
  }
}));

export default function SingleJourneyActions(props) {
  const classes = useStyles();

  const {viewMode, handleViewModeChange, handleGoBackClick} = props;
  
  return (
    <Fragment>
      <Button onClick={handleGoBackClick} className={classes.goBackBtn} variant="outlined">
        Go back
      </Button>
      <div className={classes.viewModeContainer}>
        <ToggleButtonGroup
          size="small"
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="journey view mode"
        >
          <ToggleButton value="map" aria-label="map view">
            <MapIcon/>
          </ToggleButton>
          <ToggleButton value="gallery" aria-label="photo gallery view">
            <ViewComfyIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </Fragment>
  )
}