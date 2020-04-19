import React, {useContext, useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import {Context} from "../../state/store";
import {getJourneys} from "../../utils/networkFunctions";
import {setJourneys} from "../../state/actions";
import {toast} from "react-toastify";
import JourneyCard from "./JourneyCard";
import JourneyForm from "./Forms/JourneyForm";

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
  journey: {
    marginBottom: '12px'
  },
  disclaimer: {
    marginTop: '6px',
    opacity: .6
  }
}));

export default function Journeys() {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const {journeys} = state;

  useEffect(() => {
    if (journeys.length) {
      setLoading(false);
    }

    if (!journeys.length) {
      getJourneys().then(res => {
        setLoading(false);
        setJourneys(dispatch, res.data);
      }).catch(err => toast.error(err));
    }
  }, [dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const content = () => {
    if (loading) {
      return (<CircularProgress className="Loader"/>)
    } else if (!journeys.length) {
      return (
        <Typography variant="body1">
          You don't have any journeys planned! Go ahead and create one!
        </Typography>
      )
    }

    return journeys.map(journey =>
      <JourneyCard className={classes.journey} key={journey.id} journey={journey}/>
    )
  };

  return (
    <React.Fragment>
      <Typography component='h1' variant='h3'>
        Journey planner
      </Typography>
      <Typography variant="subtitle2" className={classes.disclaimer}>
        Photos provided by Unsplash
      </Typography>
      <Divider/>
      {content()}
      <Fab onClick={handleOpen} color="primary" className="FloatingActionButton" aria-label="add">
        <AddIcon/>
      </Fab>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <JourneyForm onSubmit={handleClose}/>
          </div>
        </Fade>
      </Modal>
    </React.Fragment>
  )
}
