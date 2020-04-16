import React, {Fragment, useContext, useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardMedia from "@material-ui/core/CardMedia";
import {CardContent} from "@material-ui/core";
import EditLocationIcon from '@material-ui/icons/EditLocation';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import ClearIcon from '@material-ui/icons/Clear';
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Fade from "@material-ui/core/Fade";
import Divider from "@material-ui/core/Divider";
import ReactMapGL, {FlyToInterpolator, Marker} from "react-map-gl";
import TextField from "@material-ui/core/TextField";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {throttle} from "lodash";
import mbxClient from "@mapbox/mapbox-sdk";
import mbxGeoCoding from "@mapbox/mapbox-sdk/services/geocoding";
import MapPin from "../MapPin";
import {easeCubic} from "d3-ease";
import Button from "@material-ui/core/Button";
import _ from 'lodash';
import {DateTimePicker} from "@material-ui/pickers";
import moment from "moment";
import {Context} from "../../state/store";
import {getMapStyle} from "../../utils/mapUtils";

const useStyles = makeStyles(theme => ({
  cards: {
    marginTop: '12px'
  },
  card: {
    position: "relative"
  },
  media: {
    height: '200px'
  },
  content: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(0, 0, 0, .4)',
    transition: 'background .2s'
  },
  deletedContent: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(244, 67, 53, .7)',
    transition: 'background .2s'
  },
  updatedContent: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(75, 175, 80, .7)',
    transition: 'background .2s'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(4),
    outline: 'none'
  },
  note: {
    marginBottom: '12px'
  },
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  back: {
    marginTop: '12px',
    marginRight: '6px'
  },
  next: {
    marginTop: '12px'
  }
}));

const deleted = 'deleted';
const updated = 'updated';

export default function UploadPhotosStep2(props) {
  const baseClient = mbxClient({accessToken: process.env.REACT_APP_MAPBOX_TOKEN});
  const geoCodingClient = mbxGeoCoding(baseClient);

  const classes = useStyles();

  const {files, updateFiles, calculatedViewport, handleBack, handleNext} = props;

  const [state] = useContext(Context);
  const {darkMode} = state;
  
  const [open, setOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState({});
  const [invalidPhotos, setInvalidPhotos] = useState([]);
  const [options, setOptions] = React.useState([]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState(moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm'));
  const [marker, setMarker] = useState({});

  const getZoom = () => {
    if (!calculatedViewport.zoom) {
      return 1;
    }
    if (calculatedViewport.zoom > 22) {
      return 16;
    }
    return calculatedViewport.zoom;
  };

  const [viewport, setViewport] = useState({
    width: "50vw",
    height: "50vh",
    latitude: calculatedViewport.latitude || 20,
    longitude: calculatedViewport.longitude || 0,
    zoom: getZoom()
  });

  useEffect(() => {
    setInvalidPhotos(files);
  }, [props]);
  
  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        if (request.input.length < 3) {
          return;
        }
        geoCodingClient.forwardGeocode({
          query: request.input
        })
          .send()
          .then(response => {
            callback(response.body.features)
          });
      }, 200),
    [],
  );

  useEffect(() => {
    let active = true;

    if (input === '') {
      setOptions([]);
      return undefined;
    }

    fetch({input: input}, (results) => {
      if (active) {
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [input, fetch]);

  const handleTriggerEdit = (photo) => {
    setMarker({});
    setEditingPhoto(photo);
    setOpen(true);
  };

  const handleTriggerDelete = (photo) => {
    photo.status = deleted
    setInvalidPhotos([
      ...invalidPhotos.filter(invalidPhoto => invalidPhoto !== photo), photo
    ]);
  };

  const handleTriggerRestore = (photo) => {
    photo.status = undefined;
    setInvalidPhotos(_.orderBy([
      ...invalidPhotos.filter(invalidPhoto => invalidPhoto !== photo), photo
    ], 'status', 'desc'));
  };

  const handleClose = () => {
    setEditingPhoto({});
    setOpen(false);
  };

  const handleInputChange = event => {
    setInput(event.target.value);
  };

  const handleMapClick = e => {
    setMarker({longitude: e.lngLat[0], latitude: e.lngLat[1]});
  };

  const handleSaveLocation = () => {
    editingPhoto.location =  {lat: marker.latitude, lon: marker.longitude};
    editingPhoto.date = moment(date).format();
    editingPhoto.status = updated
    // editingPhoto.location = {lat: marker.latitude, lon: marker.longitude};
    setInvalidPhotos(_.orderBy([
      ...invalidPhotos.filter(invalidPhoto => invalidPhoto !== editingPhoto), editingPhoto
    ], 'status', 'desc'));
    handleClose();
  };

  const canFinishStep = () => {
    return !invalidPhotos.every(photo => photo.status === deleted || (photo.status && photo.date
      && photo.location.lat && photo.location.lon));
  };

  const renderInvalidPhotoContentActions = (photo) => {
    if (photo.status === deleted) {
      return (
        <CardContent className={classes.deletedContent}>
          <RestoreFromTrashIcon onClick={() => handleTriggerRestore(photo)} className="regular-icon"/>
        </CardContent>
      )
    }

    if (photo.status === updated) {
      return (
        <CardContent className={classes.updatedContent}>
          <ClearIcon onClick={() => handleTriggerRestore(photo)} className="regular-icon"/>
        </CardContent>
      )
    }

    return (
      <CardContent className={classes.content}>
        <EditLocationIcon onClick={() => handleTriggerEdit(photo)} className="regular-icon"/>
        <DeleteForeverIcon onClick={() => handleTriggerDelete(photo)} className="regular-icon"/>
      </CardContent>
    );
  };

  const renderInvalidPhotos = () => {
    if (!invalidPhotos.length) {
      return;
    }

    return invalidPhotos.map(photo => (
      <Grid key={photo.path} item xs={12} sm={6} md={4}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            src={photo.preview}
            title={photo.path}
            component="img"
          />
          {renderInvalidPhotoContentActions(photo)}
        </Card>
      </Grid>
    ));
  };

  const renderMapMarker = () => {
    if (!marker || !marker.longitude || !marker.latitude) {
      return;
    }

    return (
      <Marker longitude={marker.longitude} latitude={marker.latitude}>
        <MapPin/>
      </Marker>
    )
  };

  return (
    <Fragment>
      <Typography variant="body1" className={classes.note}>
        We have failed to determine information about the following images. 
        Most popular reasons why it might have happened, is because location was not turned on when photo also taken. 
        Also, the image might have been downloaded from the Internet.
      </Typography>
      <Typography variant="body1">
        Every photo should be revised and information filled in manually, alternatively, photo can be removed.
      </Typography>
      <Grid className={classes.cards} container spacing={2}>
        {renderInvalidPhotos()}
      </Grid>
      <Button variant="outlined" className={classes.back} onClick={handleBack}>
        Back
      </Button>
      <Button disabled={canFinishStep()} variant="outlined" className={classes.next}
              onClick={() => {
                updateFiles();
                handleNext();
              }}
      >
        Next
      </Button>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Typography variant="body2" className={classes.note}>
              Enter the date of picture:
            </Typography>
            <DateTimePicker
              id="date"
              name="date"
              label="Picture date"
              variant="outlined"
              inputVariant="outlined"
              fullWidth
              required
              value={date}
              format="YYYY-MM-DD HH:mm"
              onChange={value => {
                setDate(moment(value).format('YYYY-MM-DD HH:mm'));
              }}
            />
            <Divider/>
            <Typography variant="body2" className={classes.note}>
              Enter either location name or address:
            </Typography>
            <Autocomplete
              style={{width: "100%"}}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.place_name)}
              filterOptions={(x) => x}
              options={options}
              autoComplete
              includeInputInList
              onChange={e => {
                if (!e.currentTarget || !e.currentTarget.children || !e.currentTarget.children[0]) {
                  return;
                }
                const data = e.currentTarget.children[0].dataset;
                const longitude = parseFloat(data.lon);
                const latitude = parseFloat(data.lat);
                setMarker({longitude, latitude})
                setViewport({
                  ...viewport,
                  longitude,
                  latitude,
                  zoom: 12,
                  transitionDuration: 3000,
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionEasing: easeCubic
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Place"
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              )}
              renderOption={(option) => {
                const address = option.properties.address ? option.properties.address : option.place_name;
                return (
                  <Grid container alignItems="center" data-lon={option.center[0]} data-lat={option.center[1]}>
                    <Grid item>
                      <LocationOnIcon className={classes.icon}/>
                    </Grid>
                    <Grid item xs>
                    <span>
                      {option.text}
                    </span>
                      <Typography variant="body2" color="textSecondary">
                        {address}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              }}
            />
            <div className="separator">
              OR
            </div>
            <Typography variant="body2" className={classes.note}>
              Click on map to select the location:
            </Typography>
            <ReactMapGL
              {...viewport}
              onViewportChange={(viewport) => setViewport(viewport)}
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              mapStyle={getMapStyle(darkMode)}
              onClick={handleMapClick}
            >
              {renderMapMarker()}
            </ReactMapGL>
            <Divider/>
            <Button onClick={handleSaveLocation}
                    fullWidth
                    disabled={!marker.latitude || !marker.longitude}
                    variant="outlined">
              Save
            </Button>
          </div>
        </Fade>
      </Modal>
    </Fragment>
  )
}