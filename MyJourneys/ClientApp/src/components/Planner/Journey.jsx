import React from "react";
import {useParams} from "react-router";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import JourneyItemsSpeedDial from "./JourneyItemsSpeedDial";

export default function Journey() {
  let {location, id} = useParams();

  return (
    <React.Fragment>
      <Typography component='h1' variant='h3'>
        {location}
        <span>
          <OfflinePinIcon/>+
        </span>
      </Typography>
      <Divider/>
      <Typography variant="body1">
        {location} journey has no items added! Click button in bottom right to get started!
      </Typography>
      <JourneyItemsSpeedDial journeyId={id}/>
    </React.Fragment>
  )
}