import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import {getPhotoUrl} from "../../utils/mapUtils";
import {CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.default,
    padding: '1px 8px',
    borderRadius: '4px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.action.disabled,
  },
  card: {
    height: '76px',
    maxWidth: '500px',
    display: 'flex',
    margin: '8px 0',
    cursor: 'pointer',
    transition: 'background .2s',
    "&:hover": {
      background: theme.palette.background.default
    }
  },
  photo: {
    width: '80px',
    [theme.breakpoints.up('sm')]: {
      width: '120px'
    }
  },
  content: {
    display: 'flex',
    alignItems: 'center'
  }
}));

export default function OverviewJourneysList(props) {
  const classes = useStyles();
  const {journeys} = props;

  if (!journeys.length) {
    return;
  }

  console.log(journeys);
  return (
    <div className={classes.root}>
      {journeys.map(journey => (
        <Card className={classes.card} key={journey.id}>
          <CardMedia src={getPhotoUrl(journey.coverPhoto.path)} component="img" className={classes.photo}/>
          <CardContent className={classes.content}>
            <Typography variant='body1'>
              {journey.title}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  )

}