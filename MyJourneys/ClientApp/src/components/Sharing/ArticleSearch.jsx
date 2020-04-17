import React from "react";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import _ from 'lodash';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '12px'
  }
}));

export default function ArticleSearch(props) {
  const classes = useStyles();
  const {onChange} = props;

  let debouncedFn = undefined;
  const handleChange = e => {
    e.persist();
    if (!debouncedFn) {
      debouncedFn = _.debounce(() => {
        onChange(e.target.value);
      }, 300);
    }
    debouncedFn();
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={1} alignItems="flex-end" className={classes.search}>
        <Grid item>
          <SearchIcon/>
        </Grid>
        <Grid item>
          <TextField onChange={handleChange} id="input-with-icon-grid" label="Search" size="small"/>
        </Grid>
      </Grid>
    </div>
  )

}