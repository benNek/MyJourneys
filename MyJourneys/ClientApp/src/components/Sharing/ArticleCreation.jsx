import React from "react";
import {Link} from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  card: {
    maxWidth: 150,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function ArticleCreation() {
  const classes = useStyles();

  const articleTypes = [
    "blog", "travelPlan"
  ];

  const articles = articleTypes.map(type => {
    return (
      <Grid item xs={2}>
        <Card>
          <img src="https://via.placeholder.com/200" alt=""/>
          <CardContent>
            {type}
          </CardContent>
        </Card>
      </Grid>
    )
  });

  return (
    <div>
      Choose article type
      <Grid container spacing={3}>
        {articles}
      </Grid>
    </div>
  )
}
