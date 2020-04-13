import React, {Fragment, useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {useDropzone} from "react-dropzone";
import Button from "@material-ui/core/Button";
import {uploadPhoto} from "../../utils/networkFunctions";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import {CardContent} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CheckIcon from '@material-ui/icons/Check';

import './UploadPhotosPage.css';

const useStyles = makeStyles(() => ({
  acceptedTitle: {
    marginBottom: '12px'
  },
  card: {
    display: 'flex',
    marginBottom: '12px'
  },
  preview: {
    width: '40px'
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

export default function UploadPhotosPage() {
  const classes = useStyles();
  const [files, setFiles] = useState([]);

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const handleSubmitPhotos = () => {
    const fd = new FormData();
    acceptedFiles.forEach(file => {
      fd.append("file", file);
    });
    uploadPhoto(fd).then(r => console.log(r)).catch(err => console.log(err));
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
              <CheckIcon className="success-icon"/>
            </CardContent>
          </Card>
        ))}
        <Button variant="outlined" onClick={handleSubmitPhotos}>
          Next
        </Button>
      </Fragment>
    )
  };

  return (
    <Fragment>
      <Typography component='h1' variant='h3'>
        Upload photos
      </Typography>
      <Divider/>
      <div {...getRootProps({className: `dropzone ${files.length ? 'dz-small' : 'dz-tall'}`})}>
        <input {...getInputProps()} />
        <p>Click to select photos</p>
      </div>
      {renderFiles()}
    </Fragment>
  )
}