import React, {useState} from "react";
import Fab from "@material-ui/core/Fab";
import AddLocationIcon from '@material-ui/icons/AddLocation';
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Fade from "@material-ui/core/Fade";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useParams} from "react-router";
import PlaceForm from "./Forms/PlaceForm";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import {reorderPlaces} from "../../utils/networkFunctions";


const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2, 4, 3),
  },
  card: {
    marginBottom: '12px'
  },
  formControl: {
    marginBottom: '12px',
    minWidth: '150px'
  },
  routeLink: {
    display: 'block',
    marginBottom: '12px'
  },
  link: {
    padding: '6px 8px'
  }
}));

export default function Places(props) {
  let {id} = useParams();
  const {places} = props;

  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [travelType, setTravelType] = useState('auto');

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleTravelTypeChange = (event) => {
    setTravelType(event.target.value);
  };
  
  const handleReorderPlacesClick = () => {
    reorderPlaces(id).then(result => console.log(result.data));
  };

  const renderContent = () => {
    const hasPlaces = !!places.length;

    if (!hasPlaces) {
      return (
        <Typography variant="body1">
          No places have been added yet!
        </Typography>
      )
    }

    const routeUrl = generateDirectionsUrl();
    return (
      <React.Fragment>
        {routeUrl &&
        <React.Fragment>
          <FormControl className={classes.formControl}>
            <InputLabel id="transit-type-label">Travel Type</InputLabel>
            <Select
              labelId="travel-type-label"
              id="travel-type"
              value={travelType}
              onChange={handleTravelTypeChange}
              label="Travel type"
            >
              <MenuItem value='auto'>Recommended</MenuItem>
              <MenuItem value='driving'>Driving</MenuItem>
              <MenuItem value='walking'>Walking</MenuItem>
              <MenuItem value='bicycling'>Bicycling</MenuItem>
              <MenuItem value='transit'>Transit</MenuItem>
            </Select>
          </FormControl>
          <Link href={routeUrl} target="_blank" rel="noopener" className={classes.routeLink}>
            Show route on maps
          </Link>
          <Button onClick={handleReorderPlacesClick} variant="contained" color="primary">
            Reorder places for best route
          </Button>
        </React.Fragment>
        }
        {renderPlaces()}
      </React.Fragment>
    );
  };

  // TODO react test
  const generateDirectionsUrl = () => {
    const values = Object.values(places);
    const origin = values.shift();
    const destination = values.pop();

    let waypoints = '';
    values.forEach(place =>
      waypoints += `${place.latitude},${place.longitude}|`
    );
    waypoints = waypoints.substring(0, waypoints.length - 1);

    const baseUrl = 'https://www.google.com/maps/dir/?api=1';
    const originUrl = origin ? `&origin=${origin.latitude},${origin.longitude}` : '';
    const destinationUrl = destination ? `&destination=${destination.latitude},${destination.longitude}` : '';
    const waypointsUrl = waypoints ? `&waypoints=${waypoints}` : '';
    const travelTypeUrl = travelType && travelType !== 'auto' ? `&travelmode=${travelType}` : '';

    const url = `${baseUrl}${originUrl}${destinationUrl}${travelTypeUrl}${waypointsUrl}`;
    if (!url.includes('origin') || !url.includes('destination')) {
      return '';
    }
    return url;
  };

  const renderPlaces = () => {
    return places.map(place =>
      <Card key={place.id} className={classes.card}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {place.location}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {place.address}
          </Typography>
        </CardContent>
        <CardActions>
          <Link
            href={`https://www.google.com/maps/place/${place.latitude}+${place.longitude}/@${place.latitude},${place.longitude},15z`}
            className={classes.link}
            target="_blank"
            rel="noopener"
          >
            Find on maps
          </Link>
        </CardActions>
      </Card>
    )
  };

  return (
    <React.Fragment>
      {renderContent()}
      <Fab onClick={handleModalOpen} aria-label="add note" color="primary" className="FloatingActionButton">
        <AddLocationIcon/>
      </Fab>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modalOpen}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <div className={classes.paper}>
            <PlaceForm onSubmit={handleModalClose} journeyId={id}/>
          </div>
        </Fade>
      </Modal>
    </React.Fragment>

  )
}