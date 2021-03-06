import React, {Fragment, useState} from "react";
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
import {reorderPlaces} from "../../utils/networkFunctions";
import Grid from "@material-ui/core/Grid";
import RecommendedAction from "../RecommendedAction";
import MapIcon from '@material-ui/icons/Map';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import {toast} from "react-toastify";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import IconButton from "@material-ui/core/IconButton";
import {generateDirectionsUrl} from "../../utils/mapUtils";

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
  recommendedActions: {
    marginBottom: '12px'
  },
  heading: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  link: {
    padding: '6px 8px'
  },
  actions: {
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  button: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: '8px'
    },
  }
}));

export default function Places(props) {
  let {id} = useParams();
  const {journey, places, onPlaceAdd, onPlaceDelete, onReorder, onSetStart} = props;

  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleReorderPlacesClick = () => {
    reorderPlaces(id).then(result => {
      onReorder(result.data);
      toast.success('Places have been reordered!')
    });
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

    const routeUrl = generateDirectionsUrl(places);
    return (
      <React.Fragment>
        {routeUrl &&
        <Grid container spacing={2} className={classes.recommendedActions}>
          <Grid item xs={12} sm={6}>
            <RecommendedAction Icon={MapIcon} text="Show route on maps" link={routeUrl} target="_blank"/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <RecommendedAction Icon={RotateRightIcon} text="Reorder based on best route"
                               onClick={handleReorderPlacesClick}/>
          </Grid>
        </Grid>
        }
        {renderPlaces()}
      </React.Fragment>
    );
  };
  
  const renderPlaces = () => {
    return places.map(place =>
      <Card key={place.id} className={`${classes.card} journey__place`}>
        <CardContent>
          <div className={classes.heading}>
            <Typography gutterBottom variant="h5" component="h2">
              {place.location}
            </Typography>
            <IconButton disabled={place.start} onClick={() => onPlaceDelete(place.id)} variant="outlined">
              <DeleteForeverIcon/>
            </IconButton>
          </div>
          <Typography variant="body2" color="textSecondary" component="p">
            {place.address}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Link
            href={`https://www.google.com/maps/place/${place.latitude}+${place.longitude}/@${place.latitude},${place.longitude},15z`}
            className={classes.link}
            target="_blank"
            rel="noopener"
          >
            Find on maps
          </Link>
          <div className={classes.buttons}>
            <Button onClick={() => onSetStart(place.id)} disabled={place.start}
                    variant={place.start ? "contained" : "outlined"}
                    startIcon={<FirstPageIcon/>} className={classes.button} size="small">
              Start point
            </Button>
          </div>
        </CardActions>
      </Card>
    )
  };

  if (_.isEmpty(journey)) {
    return (<Fragment/>);
  }

  return (
    <React.Fragment>
      {renderContent()}
      {!journey.expired &&
      <Fab onClick={handleModalOpen} aria-label="add note" color="primary" className="FloatingActionButton">
        <AddLocationIcon/>
      </Fab>
      }
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
            <PlaceForm onSubmit={handleModalClose} onSuccess={onPlaceAdd} journeyId={id}/>
          </div>
        </Fade>
      </Modal>
    </React.Fragment>

  )
}