import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import React, {Fragment} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {getPhotoUrl} from "../../utils/photoUtils";

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2),
  },
  photo: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
    maxHeight: '85vh'
  }
}));

export default function PhotoView(props) {
  const classes = useStyles();
  const {open, handleClose, photo} = props;

  if (!photo) {
    return (<Fragment/>);
  }

  return (
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
          <img src={getPhotoUrl(photo.path)} className={classes.photo} alt=""/>
        </div>
      </Fade>
    </Modal>
  )

}