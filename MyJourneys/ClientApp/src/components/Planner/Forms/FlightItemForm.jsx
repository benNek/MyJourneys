import React from "react";
import {Form, Formik} from "formik";
import moment from "moment";
import {flightItemValidation, journeyValidation} from "../../../utils/validation";
import {toast} from "react-toastify";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {DateTimePicker} from "@material-ui/pickers";
import {createFlightItem} from "../../../utils/networkFunctions";

const useStyles = makeStyles(theme => ({
  formTitle: {
    marginBottom: '24px'
  },
  submitButton: {
    marginTop: '16px'
  }
}));

export default function FlightItemForm(props) {
  const classes = useStyles();
  const {journeyId} = props;

  return (
    <Formik
      initialValues={{
        airline: '',
        flightNumber: '',
        origin: '',
        destination: '',
        departureDate: moment().add(1, 'days').format('YYYY-MM-DD hh:mm')
      }}
      validationSchema={flightItemValidation}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);

        if (props && props.onSubmit) {
          props.onSubmit();
        }

        values['journeyId'] = parseInt(journeyId);
        values['departureDate'] = moment(values.departureDate).format();
        await createFlightItem(values)
          .then(response => {
            toast.success(response.data);
          })
          .catch(err => {
            toast.error(`${err.response.data} Status code: ${err.response.status}`);
            actions.setSubmitting(false);
          });
      }}
    >
      {(formProps) => {
        const {handleChange, setFieldTouched, errors, touched, setFieldValue} = formProps;
        const change = (name, e) => {
          e.persist();
          handleChange(e);
          setFieldTouched(name, true, false);
        };
        return (
          <Form>
            <Typography className={classes.formTitle} variant='h5'>
              Add a flight
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="airline"
                  variant="outlined"
                  required
                  fullWidth
                  id="airline"
                  label="Airline"
                  autoFocus
                  error={errors.airline && touched.airline}
                  helperText={(errors.airline && touched.airline) && errors.airline}
                  onChange={change.bind(null, "airline")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="flightNumber"
                  variant="outlined"
                  required
                  fullWidth
                  id="flightNumber"
                  label="Flight Number"
                  error={errors.flightNumber && touched.flightNumber}
                  helperText={(errors.flightNumber && touched.flightNumber) && errors.flightNumber}
                  onChange={change.bind(null, "flightNumber")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="origin"
                  variant="outlined"
                  required
                  fullWidth
                  id="origin"
                  label="From"
                  error={errors.origin && touched.origin}
                  helperText={(errors.origin && touched.origin) && errors.origin}
                  onChange={change.bind(null, "origin")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="destination"
                  variant="outlined"
                  required
                  fullWidth
                  id="destination"
                  label="To"
                  error={errors.destination && touched.destination}
                  helperText={(errors.destination && touched.destination) && errors.destination}
                  onChange={change.bind(null, "destination")}
                />
              </Grid>
              <Grid item xs={12}>
                <DateTimePicker
                  id="date"
                  label="Depart date"
                  variant="outlined"
                  inputVariant="outlined"
                  fullWidth
                  format="YYYY-MM-DD hh:mm"
                  value={moment().add(1, 'days').format('YYYY-MM-DD hh:mm')}
                  error={errors.departureDate && touched.departureDate}
                  helperText={(errors.departureDate && touched.departureDate) && errors.departureDate}
                  onChange={setFieldValue}
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
              Add flight
            </Button>
          </Form>
        );
      }}
    </Formik>
  )
}