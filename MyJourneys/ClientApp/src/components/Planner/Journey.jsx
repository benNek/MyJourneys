import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import Typography from "@material-ui/core/Typography";
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import Tabs from "@material-ui/core/Tabs";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Itinerary from "./Itinerary";
import {getJourneyItems, getNotes} from "../../utils/networkFunctions";
import {toast} from "react-toastify";
import Notes from "./Notes";
import Places from "./Places";

export default function Journey() {
  let {location, id} = useParams();
  const [tab, setTab] = React.useState(0);
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    getJourneyItems(id).then(res => {
      setItems(res.data);
    }).catch(err => toast.error(err));

    getNotes(id).then(res => {
      setNotes(res.data);
    }).catch(err => toast.error(err));
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
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
      <Typography component='h1' variant='h3'>
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
        <Itinerary items={items}/>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Places/>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Notes notes={notes}/>
      </TabPanel>
    </React.Fragment>
  )
}