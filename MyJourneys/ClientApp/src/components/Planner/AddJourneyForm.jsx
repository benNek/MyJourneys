import {Form, Formik} from "formik";
import {login} from "../../utils/networkFunctions";
import {parseUser} from "../../utils/auth";
import {toast} from "react-toastify";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import {journeyValidation} from "../../utils/validation";

const useStyles = makeStyles(theme => ({
  formTitle: {
    marginBottom: '24px'
  },
  submitButton: {
    marginTop: '16px'
  }
}));

export default function AddJourneyForm() {
  const classes = useStyles();

  return (
    <Formik
      initialValues={{
        location: '',
        startDate: moment().format('YYYY-MM-DD'),
        enDate: moment().add(7, 'days').format('YYYY-MM-DD')
      }}
      validationSchema={journeyValidation}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        console.log('submitting')
        // await login(values)
        //   .then(response => {
        //     localStorage.setItem('accessToken', response.data);
        //     setUser(parseUser());
        //     toast.success("User login successfully.");
        //   })
        //   .catch(err => {
        //     toast.error(`${err.response.data} Status code: ${err.response.status}`);
        //     actions.setSubmitting(false);
        //   });

      }}
    >
      {(formProps) => {
        const {handleChange, setFieldTouched, errors, touched} = formProps;
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
                <TextField
                  id="startDate"
                  label="Start date"
                  variant="outlined"
                  type="date"
                  defaultValue={moment().format('YYYY-MM-DD')}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={errors.startDate && touched.startDate}
                  helperText={(errors.startDate && touched.startDate) && errors.startDate}
                  onChange={change.bind(null, "startDate")}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="endDate"
                  label="End date"
                  variant="outlined"
                  type="date"
                  defaultValue={moment().add(7, 'days').format('YYYY-MM-DD')}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={errors.endDate && touched.endDate}
                  helperText={(errors.endDate && touched.endDate) && errors.endDate}
                  onChange={change.bind(null, "endDate")}
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
              Login
            </Button>
          </Form>
        );
      }}
    </Formik>
  )
}