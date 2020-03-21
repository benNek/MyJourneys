import React from "react";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {useHistory} from "react-router";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  locationImage: {
    width: '200px'
  }
}));

export default function Journeys(props) {
  const classes = useStyles();
  const history = useHistory();
  const {journey} = props;

  const handleClick = () => {
    history.push('/');
  };
  
  const formatDate = date => {
    return moment(date).format('YYYY-MM-DD');
  };

  return (
    <Card onClick={handleClick} className={`${classes.root} ${props.className}`}>
      <CardMedia
        className={classes.locationImage}
        image="https://lp-cms-production.imgix.net/2019-06/c81f09d36451a030f40f459726f31a96-barcelona.jpeg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4"
        title={journey.location}
      />
      <CardContent>
        <Typography variant="h5">
          {journey.location}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {formatDate(journey.startDate)} – {formatDate(journey.endDate)}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Available offline
        </Typography>
      </CardContent>
    </Card>
  )
}