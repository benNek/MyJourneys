import React from "react";
import {Form, Formik} from "formik";
import moment from "moment";
import {flightItemValidation} from "../../../utils/validation";
import {toast} from "react-toastify";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {DateTimePicker} from "@material-ui/pickers";
import {createItem} from "../../../utils/networkFunctions";
import {ITEM_TYPE_FLIGHT} from "../../../types/journeyItemTypes";

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
  const {journey, onSubmit, onSuccess} = props;

  return (
    <Formik
      initialValues={{
        airline: '',
        flightNumber: '',
        origin: '',
        destination: '',
        date: journey.startDate
      }}
      validationSchema={flightItemValidation}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        onSubmit();

        values['journeyId'] = journey.id;
        values['type'] = ITEM_TYPE_FLIGHT;
        values['date'] = moment(values.date).format();
        await createItem(values)
          .then(response => {
            onSuccess(response.data);
            toast.success('Flight item has been successfully saved!');
          })
          .catch(err => {
            toast.error(`${err.response.data} Status code: ${err.response.status}`);
            actions.setSubmitting(false);
          });
      }}
    >
      {(formProps) => {
        const {handleChange, setFieldTouched, errors, touched, setFieldValue, values} = formProps;
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
                  name="date"
                  label="Depart date"
                  variant="outlined"
                  inputVariant="outlined"
                  minDate={journey.startDate}
                  maxDate={journey.endDate}
                  fullWidth
                  value={values['date']}
                  format="YYYY-MM-DD HH:mm"
                  error={errors.date && touched.date}
                  helperText={(errors.date && touched.date) && errors.date}
                  onChange={value => {
                    setFieldValue("date", moment(value).format('YYYY-MM-DD HH:mm'));
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
          </Form>
        );
      }}
    </Formik>
  )
}