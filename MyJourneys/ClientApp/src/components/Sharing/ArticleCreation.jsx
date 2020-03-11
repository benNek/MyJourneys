import React, {useState} from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import BlogCreation from "./BlogCreation";

const useStyles = makeStyles({
  card: {
    cursor: 'pointer'
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
  const [selectedArticleType, setSelectedArticleType] = useState(null);

  const articleTypes = [
    "blog", "travelPlan"
  ];

  const articles = articleTypes.map(type => {
    return (
      <Grid key={type} item xs={2}>
        <Card onClick={() => setSelectedArticleType(type)} className={classes.card}>
          <img src="https://via.placeholder.com/200" alt=""/>
          <CardContent>
            {type}
          </CardContent>
        </Card>
      </Grid>
    )
  });
  
  const selectedArticleWizard = () => {
    switch (selectedArticleType) {
      case "blog" :
        return (
          <BlogCreation/>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      Choose article type
      <Grid container spacing={3}>
        {articles}
      </Grid>
      {selectedArticleWizard()}
    </div>
  )
}
