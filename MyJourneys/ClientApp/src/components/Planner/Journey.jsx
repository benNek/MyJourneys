import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import Typography from "@material-ui/core/Typography";
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import Tabs from "@material-ui/core/Tabs";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Itinerary from "./Itinerary";
import {getJourney, getJourneyItems, getNotes, getPlaces} from "../../utils/networkFunctions";
import {toast} from "react-toastify";
import Notes from "./Notes";
import Places from "./Places";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: '12px',
    textAlign: 'center'
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

  const handlePlacesReorder = data => {
    setPlaces(data);
  };

  const handleAddNote = data => {
    setNotes([...notes, data]);
  };

  const handleAddItem = data => {
    setItems([...items, data]);
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
        <span>
          <OfflinePinIcon/>
        </span>
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
        <Itinerary journey={journey} items={items} onItemAdd={handleAddItem}/>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Places journey={journey} places={places} onPlaceAdd={handleAddPlace} onReorder={handlePlacesReorder}/>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Notes journey={journey} notes={notes} onNoteAdd={handleAddNote}/>
      </TabPanel>
    </React.Fragment>
  )
}