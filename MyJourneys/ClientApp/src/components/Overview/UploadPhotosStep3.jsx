import React, {Fragment} from "react";
import Typography from "@material-ui/core/Typography";
import {pastJourneyValidation} from "../../utils/validation";
import {Form, Formik} from "formik";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles(() => ({
  photosGrid: {
    margin: '12px 0'
  },
  media: {
    height: '200px'
  },
  subtitle: {
    marginBottom: '12px'
  },
  submitButton: {
    marginTop: '16px'
  },
  reset: {
    marginTop: '12px',
    display: 'block'
  }
}));

export default function UploadPhotosStep3(props) {
  const classes = useStyles();
  const {files, handleReset, handleComplete} = props;

  const renderPhotos = () => {
    return (
      <Fragment>
        <Typography variant="subtitle1">
          You're almost done. All these photos are going to be added to your journey.
        </Typography>
        <Grid className={classes.photosGrid} container spacing={2}>
          {files.map(file => (
            <Grid item key={file.path} xs={6} sm={4} lg={3}>
              <Card>
                <CardMedia
                  className={classes.media}
                  src={file.preview}
                  title={file.path}
                  component="img"
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Fragment>
    )
  };

  if (!files.length) {
    return (
      <Fragment>
        <Typography variant="subtitle1">
          No images were approved. Please re-upload them again.
          <Button variant="outlined" onClick={handleReset} className={classes.reset}>
            Start over
          </Button>
        </Typography>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Formik
        initialValues={{
          name: ''
        }}
        validationSchema={pastJourneyValidation}
        onSubmit={async (values) => {
          handleComplete(values['title']);
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
              {renderPhotos()}
              <Typography variant="subtitle1" className={classes.subtitle}>
                The only thing left is to give your journey a title.
              </Typography>
              <Grid container>
                <Grid item xs={12}>
                  <TextField
                    name="title"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    error={errors.title && touched.title}
                    helperText={(errors.title && touched.title) && errors.title}
                    onChange={change.bind(null, "title")}
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
                Upload
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Fragment>
  )

}