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
import makeStyles from "@material-ui/core/styles/makeStyles";
import _ from "lodash";
import moment from "moment";
import FlightIcon from '@material-ui/icons/Flight';
import HotelIcon from '@material-ui/icons/Hotel';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import EventIcon from '@material-ui/icons/Event';

const useStyles = makeStyles(() => ({
  day: {
    margin: '6px 0'
  },
  item: {
    display: 'flex'
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'stretch',
    marginRight: '24px',
  },
  line: {
    outline: '1px solid #E0E0E0',
    position: 'absolute',
    left: 'calc(50%)',
    top: 0,
    bottom: 0
  },
  icon: {
    display: 'flex',
    flexShrink: '0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderRadius: '50%',
    background: 'white',
    color: 'rgba(0, 0, 0, 0.54)',
    width: '40px',
    height: '40px',
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)'
  }
}));

export default function Journey() {
  const classes = useStyles();
  let {location, id} = useParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getJourneyItems(id).then(res => {
      setLoading(false);
      setItems(res.data);
    }).catch(err => toast.error(err));
  }, []);

  const getIcon = item => {
    let icon;
    switch (item.type) {
      case ITEM_TYPE_FLIGHT:
        icon = <FlightIcon/>;
        break;
      case ITEM_TYPE_HOTEL:
        icon = <HotelIcon/>;
        break;
      case ITEM_TYPE_RESERVATION:
        icon = <RestaurantIcon/>;
        break;
      case ITEM_TYPE_EVENT:
        icon = <EventIcon/>;
        break;
      default:
        icon = <FlightIcon/>
    }
    
    return (
      <div className={classes.iconContainer}>
        <div className={classes.line}/>
        <div className={classes.icon}>
          {icon}
        </div>
      </div>
    );
  };

  const getItem = item => {
    switch (item.type) {
      case ITEM_TYPE_FLIGHT:
        return <FlightItemCard flight={item}/>;
      case ITEM_TYPE_HOTEL:
        return <HotelItemCard hotel={item}/>;
      case ITEM_TYPE_RESERVATION:
        return <ReservationItemCard reservation={item}/>;
      case ITEM_TYPE_EVENT:
        return <EventItemCard event={item}/>;
      default:
        return <p>Invalid item type</p>;
    }
  };

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

    const groupedByDays = _.groupBy(items, item => moment(item.date).format('MMMM Do'));
    return Object.keys(groupedByDays).map(day => {
      const items = groupedByDays[day].map(item => {
        return (
          <div className={classes.item} key={`${item.type}-${item.id}`}>
            {getIcon(item)}
            {getItem(item)}
          </div>
        )
      });
      return (
        <React.Fragment key={day}>
          <Typography className={classes.day} variant='h6'>{day}</Typography>
          {items}
        </React.Fragment>
      )
    });
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