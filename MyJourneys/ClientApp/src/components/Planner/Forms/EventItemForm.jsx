import React from "react";
import {Form, Formik} from "formik";
import moment from "moment";
import {eventItemValidation} from "../../../utils/validation";
import {toast} from "react-toastify";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {DateTimePicker} from "@material-ui/pickers";
import {createEventItem} from "../../../utils/networkFunctions";

const useStyles = makeStyles(theme => ({
  formTitle: {
    marginBottom: '24px'
  },
  submitButton: {
    marginTop: '16px'
  }
}));

export default function EventItemForm(props) {
  const classes = useStyles();
  const {journeyId} = props;

  return (
    <Formik
      initialValues={{
        name: '',
        address: '',
        date: moment().add(1, 'days').format('YYYY-MM-DD HH:mm')
      }}
      validationSchema={eventItemValidation}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);

        if (props && props.onSubmit) {
          props.onSubmit();
        }

        values['journeyId'] = parseInt(journeyId, 10);
        values['date'] = moment(values.date).format();
        await createEventItem(values)
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
        const {handleChange, setFieldTouched, errors, touched, setFieldValue, values} = formProps;
        const change = (name, e) => {
          e.persist();
          handleChange(e);
          setFieldTouched(name, true, false);
        };
        return (
          <Form>
            <Typography className={classes.formTitle} variant='h5'>
              Add an event
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Event name"
                  autoFocus
                  error={errors.name && touched.name}
                  helperText={(errors.name && touched.name) && errors.name}
                  onChange={change.bind(null, "name")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address"
                  variant="outlined"
                  required
                  fullWidth
                  id="address"
                  label="Venue address"
                  error={errors.address && touched.address}
                  helperText={(errors.address && touched.address) && errors.address}
                  onChange={change.bind(null, "address")}
                />
              </Grid>
              <Grid item xs={12}>
                <DateTimePicker
                  id="date"
                  name="date"
                  label="Check-in date"
                  variant="outlined"
                  inputVariant="outlined"
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