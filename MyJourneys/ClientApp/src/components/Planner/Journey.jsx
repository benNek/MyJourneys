import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import Typography from "@material-ui/core/Typography";
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Tabs from "@material-ui/core/Tabs";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Itinerary from "./Itinerary";
import {
  deleteEventItem, deleteFlightItem, deleteHotelItem, deleteJourney,
  deleteNote, deletePlace, deleteReservationItem,
  getJourney,
  getJourneyItems,
  getNotes,
  getPlaces,
  setFinishPlace,
  setStartPlace
} from "../../utils/networkFunctions";
import {toast} from "react-toastify";
import Notes from "./Notes";
import Places from "./Places";
import makeStyles from "@material-ui/core/styles/makeStyles";
import _ from 'lodash';
import update from 'immutability-helper';
import {ITEM_TYPE_EVENT, ITEM_TYPE_FLIGHT, ITEM_TYPE_HOTEL, ITEM_TYPE_RESERVATION} from "../../types/journeyItemTypes";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '12px',
    textAlign: 'center'
  },
  deleteBtn: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: '16px'
    },
  }
}));

export default function Journey() {
  const classes = useStyles();
  let {location, id} = useParams();
  const [tab, setTab] = React.useState(0);
  const [journey, setJourney] = useState({});
  const [items, setItems] = useState([]);
  const [places, setPlaces] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    getJourney(id).then(res => setJourney(res.data)).catch(err => toast.error(err));
    getJourneyItems(id).then(res => setItems(res.data)).catch(err => toast.error(err));
    getPlaces(id).then(res => setPlaces(res.data)).catch(err => toast.error(err));
    getNotes(id).then(res => setNotes(res.data)).catch(err => toast.error(err));
  }, []);

  const handleDeleteClick = () => {
    deleteJourney(id).then(() => window.location = '/journeys').catch(err => console.error(err));
  };
  
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleAddPlace = data => {
    if (places.length > 2) {
      setPlaces([...places.slice(0, places.length - 1), data, ...places.slice(places.length - 1)]);
    } else {
      setPlaces([...places, data]);
    }
  };

  const handleDeletePlace = id => {
    deletePlace(id).then(res => setPlaces(places.filter(p => p.id !== res.data))).catch(err => console.error(err));
  };

  const handleSetStartPlace = id => {
    setStartPlace(journey.id, id).then(res => setPlaces(res.data)).catch(err => console.error(err));
  };

  const handleSetFinishPlace = id => {
    setFinishPlace(journey.id, id).then(res => setPlaces(res.data)).catch(err => console.error(err));
  };

  const handlePlacesReorder = data => {
    setPlaces(data);
  };

  const handleAddNote = note => {
    setNotes([...notes, note]);
  };

  const handleUpdateNote = note => {
    const index = _.findIndex(notes, ['id', note.id]);
    const newNotes = update(notes, {
      [index]: {
        $set: note
      }
    });
    setNotes(newNotes);
  };

  const handleDeleteNote = id => {
    deleteNote(id).then(res => setNotes(notes.filter(note => note.id !== res.data))).catch(err => console.error(err));
  };

  const handleAddItem = data => {
    setItems([...items, data]);
  };

  const handleDeleteItem = (id, type) => {
    setItems(items.filter(item => item.type !== type || item.id !== id));
  };

  const handleDeleteFlightItem = id => {
    deleteFlightItem(id).then(res => handleDeleteItem(res.data, ITEM_TYPE_FLIGHT)).catch(err => console.error(err));
  };

  const handleDeleteHotelItem = id => {
    deleteHotelItem(id).then(res => handleDeleteItem(res.data, ITEM_TYPE_HOTEL)).catch(err => console.error(err));
  };

  const handleDeleteReservationItem = id => {
    deleteReservationItem(id).then(res => handleDeleteItem(res.data, ITEM_TYPE_RESERVATION)).catch(err => console.error(err));
  };

  const handleDeleteEventItem = id => {
    deleteEventItem(id).then(res => handleDeleteItem(res.data, ITEM_TYPE_EVENT)).catch(err => console.error(err));
  };

  function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  }

  return (
    <React.Fragment>
      <Typography component='h1' variant='h3' className={classes.title}>
        {location}
        <div>
          <Button
            variant="outlined"
            startIcon={<OfflinePinIcon/>}
          >
            Save for offline
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteForeverIcon/>}
            className={classes.deleteBtn}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </div>
      </Typography>
      <Paper>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Itinerary"/>
          <Tab label="Places"/>
          <Tab label="Notes"/>
        </Tabs>
      </Paper>
      <TabPanel value={tab} index={0}>
        <Itinerary journey={journey} items={items} onItemAdd={handleAddItem} onFlightDelete={handleDeleteFlightItem}
                   onHotelDelete={handleDeleteHotelItem} onReservationDelete={handleDeleteReservationItem}
                   onEventDelete={handleDeleteEventItem}/>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Places journey={journey} places={places} onPlaceAdd={handleAddPlace} onPlaceDelete={handleDeletePlace}
                onReorder={handlePlacesReorder} onSetStart={handleSetStartPlace} onSetFinish={handleSetFinishPlace}/>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Notes journey={journey} notes={notes} onNoteAdd={handleAddNote} onNoteUpdate={handleUpdateNote}
               onNoteDelete={handleDeleteNote}/>
      </TabPanel>
    </React.Fragment>
  )
}