import React, {useState} from "react";
import Fab from "@material-ui/core/Fab";
import AddLocationIcon from '@material-ui/icons/AddLocation';
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Fade from "@material-ui/core/Fade";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useParams} from "react-router";
import PlaceForm from "./Forms/PlaceForm";

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
}));

export default function Places(props) {
  let {id} = useParams();

  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  
  return (
    <React.Fragment>

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