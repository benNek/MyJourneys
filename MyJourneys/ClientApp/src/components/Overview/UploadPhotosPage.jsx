import React, {Fragment, useEffect, useState} from "react";
import {uploadPhoto} from "../../utils/networkFunctions";
import Divider from "@material-ui/core/Divider";
import './UploadPhotosPage.css';
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import UploadPhotosStep1 from "./UploadPhotosStep1";
import UploadPhotosStep2 from "./UploadPhotosStep2";

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

  const handleSubmitPhotos = () => {
    const fd = new FormData();
    files.forEach(file => {
      fd.append("file", file);
    });
    uploadPhoto(fd).then(r => console.log(r)).catch(err => console.log(err));
  };

  const totalSteps = () => {
    return getSteps().length;
  };

  const completedSteps = () => {
    return completed.size;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const handleNext = () => {
    let newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed
          // find the first step that has been completed
        steps.findIndex((step, i) => !completed.has(i))
        : activeStep + 1;

    if (newActiveStep === 1 && !files.filter(file => !file.location).length) {
      newActiveStep++;
    }
    setActiveStep(newActiveStep);
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
        return <UploadPhotosStep2 files={files.filter(file => !file.location)} setFiles={setFiles}
                                  handleBack={handleBack} handleNext={handleNext}/>;
      case 2:
        return 'Step 3: This is the bit I really care about!';
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