import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    margin: '9px 0',
    width: '100%'
  },
  date: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    textAlign: 'center',
    padding: '12px 24px 24px',
    borderRight: '1px solid rgba(0, 0, 0, 0.12)'
  }
}));

export default function FlightItemCard(props) {
  const classes = useStyles();
  const {flight} = props;

  return (
    <Card className={classes.root}>
      <div className={classes.date}>
        <Typography variant='h6'>
          {moment(flight.date).format('hh:mm a')}
        </Typography>
      </div>
      <CardContent>
        <Typography variant='subtitle2'>
          {flight.airline} ({flight.flightNumber})
        </Typography>
        <Typography variant='subtitle1'>
          {flight.origin} – {flight.destination}
        </Typography>
      </CardContent>
    </Card>
  )
}