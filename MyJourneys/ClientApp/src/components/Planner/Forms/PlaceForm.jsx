import React, {useEffect} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {toast} from "react-toastify";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import mbxClient from "@mapbox/mapbox-sdk";
import mbxGeoCoding from "@mapbox/mapbox-sdk/services/geocoding";
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {throttle} from "lodash";
import {createPlace} from "../../../utils/networkFunctions";

const useStyles = makeStyles(theme => ({
  formTitle: {
    marginBottom: '24px'
  },
  submitButton: {
    marginTop: '16px'
  },
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

const acceptedTypes = [
  "place", "locality", "poi", "poi.landmark"
];

export default function PlaceForm(props) {
  const baseClient = mbxClient({accessToken: process.env.REACT_APP_MAPBOX_TOKEN});

  const geoCodingClient = mbxGeoCoding(baseClient);
  const classes = useStyles();
  const {journeyId} = props;

  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [location, setLocation] = React.useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        if (request.input.length < 3) {
          return;
        }
        geoCodingClient.forwardGeocode({
          query: request.input,
          types: acceptedTypes
        })
          .send()
          .then(response => {
            callback(response.body.features)
          });
      }, 200),
    [],
  );

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions([]);
      return undefined;
    }

    fetch({input: inputValue}, (results) => {
      if (active) {
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetch]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (props && props.onSubmit) {
      props.onSubmit();
    }

    const values = {
      journeyId: parseInt(journeyId, 10),
      location: name,
      address: address,
      latitude: parseFloat(location[0]),
      longitude: parseFloat(location[1])
    };
    await createPlace(values)
      .then(response => {
        toast.success(response.data);
      })
      .catch(err => {
        toast.error(`${err.response.data} Status code: ${err.response.status}`);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <Typography className={classes.formTitle} variant='h5'>
        Add a place
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            style={{width: 300}}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.place_name)}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            onChange={e => {
              if (!e.currentTarget || !e.currentTarget.children || !e.currentTarget.children[0]) {
                return;
              }
              const data = e.currentTarget.children[0].dataset;
              setName(data.name);
              setAddress(data.address);
              setLocation([data.lat, data.lon]);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add a location"
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
              />
            )}
            renderOption={(option) => {
              const address = option.properties.address ? option.properties.address : option.place_name;
              return (
                <Grid container alignItems="center" data-lon={option.center[0]} data-lat={option.center[1]}
                      data-name={option.text} data-address={address}>
                  <Grid item>
                    <LocationOnIcon className={classes.icon}/>
                  </Grid>
                  <Grid item xs>
                    <span>
                      {option.text}
                    </span>
                    <Typography variant="body2" color="textSecondary">
                      {address}
                    </Typography>
                  </Grid>
                </Grid>
              );
            }}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submitButton}
      >
        Save
      </Button>
    </form>
  )

}