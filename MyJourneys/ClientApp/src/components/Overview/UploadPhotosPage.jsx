import React, {Fragment} from "react";
import Typography from "@material-ui/core/Typography";
import {useDropzone} from "react-dropzone";
import Button from "@material-ui/core/Button";
import {uploadImage} from "../../utils/networkFunctions";

export default function UploadPhotosPage() {
  
  const {acceptedFiles, rejectedFiles, getRootProps, getInputProps} = useDropzone({
    accept: 'image/jpeg, image/png'
  });

  const acceptedFilesItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const rejectedFilesItems = rejectedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  
  const handleSubmitPhotos = () => {
    console.log(acceptedFiles)
    const fd = new FormData();
    acceptedFiles.forEach(file => {
      fd.append("file", file);
    });
    uploadImage(fd).then(r => console.log(r)).catch(err => console.log(err));
  };

  return (
    <Fragment>
      <Typography component='h1' variant='h3'>
        Upload photos
      </Typography>
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <ul>
          {acceptedFilesItems}
        </ul>
        <h4>Rejected files</h4>
        <ul>
          {rejectedFilesItems}
        </ul>
      </aside>
      <Button onClick={handleSubmitPhotos}>
        Submit
      </Button>
    </Fragment>
  )
}