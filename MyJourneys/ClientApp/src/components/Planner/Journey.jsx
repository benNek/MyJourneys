import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import JourneyItemsSpeedDial from "./JourneyItemsSpeedDial";
import {getJourneyItems} from "../../utils/networkFunctions";
import {toast} from "react-toastify";
import CircularProgress from "@material-ui/core/CircularProgress";
import {ITEM_TYPE_FLIGHT} from "../../types/journeyItemTypes";
import FlightItemCard from "./FlightItemCard";

export default function Journey() {
  let {location, id} = useParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getJourneyItems(id).then(res => {
      setLoading(false);
      setItems(res.data);
    }).catch(err => toast.error(err));
  }, []);

  const getItems = () => {
    if (loading) {
      return (<CircularProgress className={"Loader"}/>)
    }
    if (!items.length) {
      return (
        <Typography variant="body1">
          {location} journey has no items added! Click button in bottom right to get started!
        </Typography>
      )
    }

    return items.map(item => {
        switch (item.type) {
          case ITEM_TYPE_FLIGHT:
            return <FlightItemCard key={item.id} flight={item}/>;
          default:
            return <p>Invalid item type</p>;
        }
      }
    );
  };

  return (
    <React.Fragment>
      <Typography component='h1' variant='h3'>
        {location}
        <span>
          <OfflinePinIcon/>
        </span>
      </Typography>
      <Divider/>
      {getItems()}
      <JourneyItemsSpeedDial journeyId={id}/>
    </React.Fragment>
  )
}