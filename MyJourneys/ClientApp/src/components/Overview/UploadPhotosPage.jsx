import React, {Fragment, useEffect, useState} from "react";
import {uploadPhoto} from "../../utils/networkFunctions";
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

function getSteps() {
  return ['Upload photos', "Add missing locations", 'Create a journey'];
}

export default function UploadPhotosPage() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());
  const [files, setFiles] = useState([]);

  const steps = getSteps();

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const updateValidFiles = () => {
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

  const handleSubmit = title => {
    const fd = new FormData();
    fd.append("title", title);
    files.forEach(file => {
      fd.append("files", file);
      fd.append("dates", file.date);
      fd.append("longitudes", file.location.lon);
      fd.append("latitudes", file.location.lat);
    });
    uploadPhoto(fd).then(response => {
      toast.success(response.data);
    }).catch(err => {
      toast.error(`${err.response.data} Status code: ${err.response.status}`);
    });
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