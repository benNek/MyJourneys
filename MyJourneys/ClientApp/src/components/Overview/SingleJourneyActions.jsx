import React, {Fragment} from "react";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MapIcon from '@material-ui/icons/Map';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import {getPhotoUrl} from "../../utils/photoUtils";

const useStyles = makeStyles(theme => ({
  goBackBtn: {
    position: 'absolute',
    left: '8px',
    top: '20px',
    transition: 'left 1s',
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
  },
  container: {
    position: 'relative'
  },
  gallery: {
    position: 'relative',
    top: '68px',
    [theme.breakpoints.up('sm')]: {
      top: '72px'
    }
  },
  photo: {
    height: '200px',
    width: '100%',
    objectFit: 'cover',
    cursor: 'pointer'
  }
}));

export default function SingleJourneyActions(props) {
  const classes = useStyles();

  const {journey, viewMode, handleViewModeChange, handleGoBackClick, onPhotoClick} = props;

  const renderPhotos = () => {
    if (!isGalleryMode()) {
      return;
    }

    return (
      <Grid container spacing={2} className={classes.gallery}>
        {journey.photos.map(photo => 
          <Grid key={photo.id} item xs={6} sm={4} lg={3}>
            <img onClick={() => onPhotoClick(photo)} src={getPhotoUrl(photo.path)} className={classes.photo} alt=""/>
          </Grid>
        )}
      </Grid>
    )
  };

  const isGalleryMode = () => viewMode === 'gallery';

  const ConditionalWrapper = ({condition, wrapper, children}) =>
    condition ? wrapper(children) : children;

  return (
    <Fragment>
      <ConditionalWrapper
        condition={isGalleryMode()}
        wrapper={children => <Container maxWidth="md" className={classes.container}>{children}</Container>}
      >
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
              <ViewComfyIcon/>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        {renderPhotos()}
      </ConditionalWrapper>
    </Fragment>
  )
}