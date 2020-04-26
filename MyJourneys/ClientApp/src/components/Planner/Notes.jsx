import React, {Fragment, useState} from "react";
import Fab from "@material-ui/core/Fab";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Fade from "@material-ui/core/Fade";
import NoteForm from "./Forms/NoteForm";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useParams} from "react-router";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import _ from "lodash";

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

export default function Notes(props) {
  let {id} = useParams();
  const {journey, notes, onNoteAdd, onNoteUpdate, onNoteDelete} = props;

  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setTimeout(() => setEditingNote(null), 500);
  };

  const renderNotes = () => {
    return notes.map(note =>
      <Grid item xs={4} key={note.id}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {note.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {note.text}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={() => {
              setEditingNote(note);
              setModalOpen(true);
            }}>
              Edit
            </Button>
            <Button size="small" color="primary" onClick={() => onNoteDelete(note.id)}>
              Delete
            </Button>
          </CardActions>
        </Card>
      </Grid>
    )
  };

  if (_.isEmpty(journey)) {
    return (<Fragment/>);
  }

  return (
    <React.Fragment>
      {notes.length === 0 ?
        <Typography variant="body1">
          No notes have been added yet!
        </Typography> :
        <Grid container spacing={2}>
          {renderNotes()}
        </Grid>
      }
      {!journey.expired &&
      <Fab onClick={handleModalOpen} aria-label="add note" color="primary" className="FloatingActionButton">
        <NoteAddIcon/>
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
            <NoteForm onSubmit={handleModalClose} editingNote={editingNote} onAdd={onNoteAdd} onUpdate={onNoteUpdate}
                      journeyId={id}/>
          </div>
        </Fade>
      </Modal>
    </React.Fragment>
  )

}