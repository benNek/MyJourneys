import React, {Fragment, useState} from "react";
import {uploadJourney} from "../../utils/networkFunctions";
import Divider from "@material-ui/core/Divider";
import './UploadPhotosPage.css';
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import UploadPhotosStep1 from "./UploadPhotosStep1";
import UploadPhotosStep2 from "./UploadPhotosStep2";
import UploadPhotosStep3 from "./UploadPhotosStep3";
import WebMercatorViewport from '@math.gl/web-mercator';
import {resolveMapBounds} from "../../utils/mapUtils";
import {toast} from "react-toastify";
import mbxClient from "@mapbox/mapbox-sdk";
import mbxGeoCoding from "@mapbox/mapbox-sdk/services/geocoding";
import _ from 'lodash';
import Success from "../Success";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import RecommendedAction from "../RecommendedAction";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import MapIcon from '@material-ui/icons/Map';

function getSteps() {
  return ['Upload photos', "Add missing locations", 'Create a journey'];
}

const useStyles = makeStyles(() => ({
  successContainer: {
    textAlign: 'center'
  },
  recommendedActionsTitle: {
    marginTop: '24px'
  },
  recommendedActions: {
    marginTop: '0px',
    justifyContent: 'center'
  }
}));

export default function UploadPhotosPage() {
  const classes = useStyles();

  const baseClient = mbxClient({accessToken: process.env.REACT_APP_MAPBOX_TOKEN});
  const geoCodingClient = mbxGeoCoding(baseClient);

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());
  const [files, setFiles] = useState([]);
  const [success, setSuccess] = useState(false);

  const steps = getSteps();

  const updateValidFiles = () => {
    files.filter(file => !file.location && !file.date).forEach(file => URL.revokeObjectURL(file.preview));
    
    setFiles([
      ...files.filter(file => file.location && file.date)
    ]);
  };

  const getViewport = () => {
    const points = files.filter(file => file.date && file.location && file.location.lat && file.location.lon)
      .map(file => [file.location.lon, file.location.lat]);
    if (!points.length) {
      return {};
    }

    return new WebMercatorViewport({width: 600, height: 400})
      .fitBounds(resolveMapBounds(points), {
        padding: 20,
        offset: [0, -100]
      });
  };

  const handleReset = () => {
    setFiles([]);
    setCompleted(new Set());
    setActiveStep(0);
    window.scrollTo(0, 0);
  };

  const getCountries = async () => {
    const responses = await Promise.all(files.map(file => {
      return geoCodingClient.reverseGeocode({
        query: [file.location.lon, file.location.lat],
        types: ["country"]
      }).send();
    }));
    return _.uniq(responses
      .filter(response => response.body.features.length)
      .map(response => response.body.features[0].properties.short_code.toUpperCase()));
  };

  const handleSubmit = async title => {
    const countries = await getCountries();
    const fd = new FormData();
    fd.append("title", title);
    countries.forEach(country => {
      fd.append("countries", country);
    });
    files.forEach(file => {
      fd.append("files", file);
      fd.append("dates", file.date);
      fd.append("longitudes", file.location.lon);
      fd.append("latitudes", file.location.lat);
    });
    uploadJourney(fd).then(() => setSuccess(true)).catch(err => {
      toast.error(`${err.response.data} Status code: ${err.response.status}`);
    });

    files.forEach(file => URL.revokeObjectURL(file.preview));
  };

  const handleNext = () => {
    completed.add(activeStep);
    let newActiveStep = activeStep + 1;

    if (newActiveStep === 1 && !files.filter(file => !file.location).length) {
      completed.add(1);
      newActiveStep++;
    }

    setCompleted(completed);
    setActiveStep(newActiveStep);
    window.scrollTo(0, 0)
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  function isStepComplete(step) {
    return completed.has(step);
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <UploadPhotosStep1 files={files} setFiles={setFiles} handleNext={handleNext}/>;
      case 1:
        return <UploadPhotosStep2 files={files.filter(file => !file.location)} updateFiles={updateValidFiles}
                                  calculatedViewport={getViewport()} handleBack={handleBack} handleNext={handleNext}/>;
      case 2:
        return <UploadPhotosStep3 files={files} handleBack={handleBack} handleReset={handleReset}
                                  handleComplete={handleSubmit}/>;
      default:
        return 'Unknown step';
    }
  }

  if (success) {
    return (
      <div className={classes.successContainer}>
        <Success/>
        <Typography component='h1' variant='h4'>
          Photos uploaded sucessfully!
        </Typography>
        <Typography variant='subtitle1' className={classes.recommendedActionsTitle}>
          Recommended actions:
        </Typography>
        <Grid container spacing={4} className={classes.recommendedActions}>
          <Grid item xs={12} sm={6} md={4}>
            <RecommendedAction Icon={AddAPhotoIcon} text="Add more photos" reload={true}/>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RecommendedAction Icon={MapIcon} text="View the map" link='/overview'/>
          </Grid>
        </Grid>
      </div>
    )
  }

  return (
    <Fragment>
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const buttonProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepButton
                completed={isStepComplete(index)}
                {...buttonProps}
              >
                {label}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
      <Divider/>
      {getStepContent(activeStep)}
    </Fragment>
  )
}