import React, {Fragment, useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardMedia from "@material-ui/core/CardMedia";
import {CardContent} from "@material-ui/core";
import EditLocationIcon from '@material-ui/icons/EditLocation';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Fade from "@material-ui/core/Fade";
import Divider from "@material-ui/core/Divider";
import ReactMapGL, {Marker} from "react-map-gl";

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
    background: 'rgba(0, 0, 0, .4)'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2, 4, 3),
    outline: 'none'
  }
}));

export default function UploadPhotosStep2(props) {
  const classes = useStyles();
  const {files, handleNext} = props;
  const [open, setOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState({});
  const [invalidPhotos, setInvalidPhotos] = useState([]);
  const [map, setMap] = useState({});
  const [marker, setMarker] = useState({});
  const [viewport, setViewport] = useState({
    width: "50vw",
    height: "50vh",
    latitude: 42.361145,
    longitude: -71.057083,
    zoom: 8
  });

  useEffect(() => {
    setInvalidPhotos(files);
  }, [props]);

  const handleTriggerEdit = (photo) => {
    setEditingPhoto(photo);
    setOpen(true);
    // map.resize();
  };

  const handleTriggerDelete = (photo) => {
    setInvalidPhotos(invalidPhotos.filter(invalidPhoto => invalidPhoto !== photo));
  };

  const handleClose = () => {
    setEditingPhoto({});
    setOpen(false);
  };

  const handleMapLoad = map => {
    setMap(map);
  };

  const handleMapClick = e => {
    console.log(e.lngLat)
    setMarker({longitude: e.lngLat[0], latitude: e.lngLat[1]});
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
          <CardContent className={classes.content}>
            <EditLocationIcon onClick={() => handleTriggerEdit(photo)} className="regular-icon"/>
            <DeleteForeverIcon onClick={() => handleTriggerDelete(photo)} className="regular-icon"/>
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  return (
    <Fragment>
      <Typography variant="body1">
        We have failed to determine information about the following images. It might have happened because of X.
      </Typography>
      <Typography variant="body1">
        Every photo should be revised and information filled in manually, alternatively, photo can be removed.
      </Typography>
      <Grid className={classes.cards} container spacing={2}>
        {renderInvalidPhotos()}
      </Grid>

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
            <div>
              Enter address
              <input type="text"/>
            </div>
            <Divider/>
            <ReactMapGL
              {...viewport}
              onViewportChange={(viewport) => setViewport(viewport)}
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              onLoad={handleMapLoad}
              onClick={handleMapClick}
            >
              <Marker longitude={-71.057083} latitude={42.361145}/>
              {console.log(marker) && marker ? <Marker longitude={marker.longitude} latitude={marker.latitude}/> : null}
            </ReactMapGL>
          </div>
        </Fade>
      </Modal>
    </Fragment>
  )
}