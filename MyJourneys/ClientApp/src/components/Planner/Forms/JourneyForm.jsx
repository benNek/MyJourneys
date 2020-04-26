import {Form, Formik} from "formik";
import {toast} from "react-toastify";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import {journeyValidation} from "../../../utils/validation";
import {createJourney} from "../../../utils/networkFunctions";
import {DatePicker} from "@material-ui/pickers";

const useStyles = makeStyles(theme => ({
  formTitle: {
    marginBottom: '24px'
  },
  submitButton: {
    marginTop: '16px'
  }
}));

export default function JourneyForm(props) {
  const classes = useStyles();
  
  const { onSubmit, onSuccess} = props;

  return (
    <Formik
      initialValues={{
        location: '',
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(7, 'days').format('YYYY-MM-DD')
      }}
      validationSchema={journeyValidation}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        onSubmit();
        
        await createJourney(values)
          .then(response => {
            toast.success("Journey has been successfully added");
            onSuccess(response.data);
          })
          .catch(err => {
            toast.error(`${err.response.data} Status code: ${err.response.status}`);
            actions.setSubmitting(false);
          });
      }}
    >
      {(formProps) => {
        const {handleChange, setFieldTouched, setFieldValue, values, errors, touched} = formProps;
        const change = (name, e) => {
          e.persist();
          handleChange(e);
          setFieldTouched(name, true, false);
        };
        return (
          <Form className={classes.form}>
            <Typography className={classes.formTitle} variant='h5'>
              Start planning your journey
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="location"
                  name="location"
                  variant="outlined"
                  required
                  fullWidth
                  id="location"
                  label="Location"
                  autoFocus
                  error={errors.location && touched.location}
                  helperText={(errors.location && touched.location) && errors.location}
                  onChange={change.bind(null, "location")}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  id="startDate"
                  label="Start date"
                  variant="outlined"
                  inputVariant="outlined"
                  fullWidth
                  value={values['startDate']}
                  format="YYYY-MM-DD"
                  error={errors.startDate && touched.startDate}
                  helperText={(errors.startDate && touched.startDate) && errors.startDate}
                  onChange={value => {
                    setFieldValue('startDate', moment(value).format('YYYY-MM-DD'));
                    const endDate = moment(values['endDate']);
                    if (endDate.isBefore(value, 'day')) {
                      setFieldValue('endDate', value.add(7, 'day'));
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  id="endDate"
                  label="End date"
                  variant="outlined"
                  inputVariant="outlined"
                  fullWidth
                  minDate={values['startDate']}
                  value={values['endDate']}
                  format="YYYY-MM-DD"
                  error={errors.endDate && touched.endDate}
                  helperText={(errors.endDate && touched.endDate) && errors.endDate}
                  onChange={value => {
                    setFieldValue("endDate", moment(value).format('YYYY-MM-DD'));
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
              Create
            </Button>
          </Form>
        );
      }}
    </Formik>
  )
}