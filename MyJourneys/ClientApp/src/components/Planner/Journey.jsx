import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import JourneyItemsSpeedDial from "./JourneyItemsSpeedDial";
import {getJourneyItems} from "../../utils/networkFunctions";
import {toast} from "react-toastify";
import CircularProgress from "@material-ui/core/CircularProgress";
import {ITEM_TYPE_EVENT, ITEM_TYPE_FLIGHT, ITEM_TYPE_HOTEL, ITEM_TYPE_RESERVATION} from "../../types/journeyItemTypes";
import FlightItemCard from "./FlightItemCard";
import HotelItemCard from "./HotelItemCard";
import ReservationItemCard from "./ReservationItemCard";
import EventItemCard from "./EventItemCard";

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
            return <FlightItemCard key={`${item.type}-${item.id}`} flight={item}/>;
          case ITEM_TYPE_HOTEL:
            return <HotelItemCard key={`${item.type}-${item.id}`} hotel={item}/>;
          case ITEM_TYPE_RESERVATION:
            return <ReservationItemCard key={`${item.type}-${item.id}`} reservation={item}/>;
          case ITEM_TYPE_EVENT:
            return <EventItemCard key={`${item.type}-${item.id}`} event={item}/>;
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