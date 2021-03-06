import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import Link from "@material-ui/core/Link";
import {CardActions} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

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
  },
  action: {
    marginLeft: 'auto'
  }
}));

export default function ReservationItemCard(props) {
  const classes = useStyles();
  const {reservation, onDelete} = props;

  return (
    <Card className={classes.root}>
      <div className={classes.date}>
        <Typography variant='h6'>
          {moment(reservation.date).format('hh:mm a')}
        </Typography>
      </div>
      <CardContent>
        <Typography variant='subtitle2'>
          {reservation.name}
        </Typography>
        <Typography variant='subtitle1'>
          {reservation.address}
        </Typography>
        <Typography variant='body2'>
          <Link href={`https://www.google.com/maps/place/${encodeURI(reservation.address)}`} target="_blank" rel="noopener">
            Find on maps
          </Link>
        </Typography>
      </CardContent>
      <CardActions className={classes.action}>
        <IconButton onClick={() => onDelete(reservation.id)} variant="outlined" aria-label='delete item'>
          <DeleteForeverIcon/>
        </IconButton>
      </CardActions>
    </Card>
  )
}