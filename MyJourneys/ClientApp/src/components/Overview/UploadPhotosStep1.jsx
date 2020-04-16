import makeStyles from "@material-ui/core/styles/makeStyles";
import React, {Fragment} from "react";
import {useDropzone} from "react-dropzone";
import {resolveLatLon} from "../../utils/mapUtils";
import CheckIcon from "@material-ui/icons/Check";
import Tooltip from "@material-ui/core/Tooltip";
import WarningIcon from "@material-ui/icons/Warning";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import {CardContent} from "@material-ui/core";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  dropzone: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderWidth: '2px',
    borRadius: '2px',
    borderColor: theme.palette.text.secondary,
    borderStyle: 'dashed',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.secondary,
    outline: 'none',
    transition: 'border .24s ease-in-out, height .24s ease-in-out'
  },
  acceptedTitle: {
    marginBottom: '12px'
  },
  card: {
    display: 'flex',
    marginBottom: '12px',
    maxHeight: '76px'
  },
  preview: {
    width: '80px',
    [theme.breakpoints.up('sm')]: {
      width: '120px'
    },
  },
  cardContent: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  fileName: {
    margin: 0
  }
}));

export default function UploadPhotosStep1(props) {
  const {files, setFiles, handleNext} = props;
  const classes = useStyles();

  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop: acceptedFiles => {
      const tempFiles = acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
      tempFiles.forEach(file => {
        resolveLatLon(file);
      });

      setTimeout(() => {
        setFiles(tempFiles);
      }, 100);
    }
  });

  const renderStatus = (file) => {
    if (file.location) {
      return (
        <CheckIcon className="success-icon"/>
      );
    } else {
      return (
        <Tooltip
          title="We couldn't determine location and/or date of the photo. Further action is needed on next step.">
          <WarningIcon className="warning-icon"/>
        </Tooltip>
      );
    }
  };

  const renderFiles = () => {
    if (!files.length) {
      return <Fragment/>
    }

    return (
      <Fragment>
        <Divider/>
        <Typography variant='h6' className={classes.acceptedTitle}>Selected photos</Typography>
        {files.map(file => (
          <Card key={file.path} className={`${classes.card} dz-preview dz-file-preview`}>
            <CardMedia src={file.preview} component="img" className={classes.preview}/>
            <CardContent className={classes.cardContent}>
              <Typography className={classes.fileName} variant='body1'>
                {file.path}
              </Typography>
              {renderStatus(file)}
            </CardContent>
          </Card>
        ))}
        <Button variant="outlined" onClick={handleNext}>
          Next
        </Button>
      </Fragment>
    )
  };

  return (
    <Fragment>
      <div {...getRootProps({className: `${classes.dropzone} dropzone ${files.length ? 'dz-small' : 'dz-tall'}`})}>
        <input {...getInputProps()} />
        <p>Click to select photos</p>
      </div>
      {renderFiles()}
    </Fragment>
  )

}