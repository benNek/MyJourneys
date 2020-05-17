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
import {Add} from "@material-ui/icons";

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
  const {journeyId, onSubmit, onSuccess} = props;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit();

    const values = {
      journeyId: parseInt(journeyId, 10),
      location: name,
      address: address,
      latitude: parseFloat(location[0]),
      longitude: parseFloat(location[1])
    };
    console.log(values)
    await createPlace(values)
      .then(response => {
        onSuccess(response.data);
        toast.success('Place has been successfully added!');
      })
      .catch(err => {
        toast.error(`${err.response.data} Status code: ${err.response.status}`);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
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
            onChange={(e, value) => {
              if (!value) {
                return;
              }
              const lon = value.center[0];
              const lat = value.center[1];
              const name = value.text;
              const address = value.properties.address ? value.properties.address : value.place_name;
              if (!lon || !lat || !name || !Add) {
                return;
              }
              setName(name);
              setAddress(address);
              setLocation([lat, lon]);
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
                <Grid container alignItems="center">
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