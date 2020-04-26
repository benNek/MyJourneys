import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {noteValidation} from "../../../utils/validation";
import {createNote} from "../../../utils/networkFunctions";
import {toast} from "react-toastify";
import {Form, Formik} from "formik";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() => ({
  formTitle: {
    marginBottom: '24px'
  },
  submitButton: {
    marginTop: '16px'
  }
}));

export default function NoteForm(props) {
  const classes = useStyles();
  const {journeyId, onSubmit, onSuccess} = props;

  return (
    <Formik
      initialValues={{
        title: '',
        text: ''
      }}
      validationSchema={noteValidation}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        onSubmit();

        values['journeyId'] = parseInt(journeyId, 10);
        await createNote(values)
          .then(response => {
            onSuccess(response.data);
            toast.success('Note has been successfully saved!');
          })
          .catch(err => {
            toast.error(`${err.response.data} Status code: ${err.response.status}`);
            actions.setSubmitting(false);
          });
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
          <Form>
            <Typography className={classes.formTitle} variant='h5'>
              Add a note
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  autoFocus
                  error={errors.title && touched.title}
                  helperText={(errors.title && touched.title) && errors.title}
                  onChange={change.bind(null, "title")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="text"
                  multiline
                  rows="2"
                  rowsMax="4"
                  required
                  fullWidth
                  id="text"
                  label="Text"
                  error={errors.text && touched.text}
                  helperText={(errors.text && touched.text) && errors.text}
                  onChange={change.bind(null, "text")}
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