import React, {useCallback, useState} from 'react';
import RetrospectiveMap from "./RetrospectiveMap";
import Typography from "@material-ui/core/Typography";
import './Retrospective.css';
import Button from "@material-ui/core/Button";
import {useDropzone} from "react-dropzone";
import EXIF from "exif-js/exif";
import {convertDMSToDD} from "../../utils/mapUtils";

export default function Retrospective() {

  const [lat, setLat] = useState(42.361145);
  const [lon, setLon] = useState(-71.057083);

  const onDrop = useCallback(acceptedFiles => {
    EXIF.getData(acceptedFiles[0], function() {
      var latDegree = this.exifdata.GPSLatitude[0].numerator;
      var latMinute = this.exifdata.GPSLatitude[1].numerator;
      var latSecond = this.exifdata.GPSLatitude[2].numerator / this.exifdata.GPSLatitude[2].denominator;
      var latDirection = this.exifdata.GPSLatitudeRef;

      var latFinal = convertDMSToDD(latDegree, latMinute, latSecond, latDirection);

      var lonDegree = this.exifdata.GPSLongitude[0].numerator;
      var lonMinute = this.exifdata.GPSLongitude[1].numerator;
      var lonSecond = this.exifdata.GPSLongitude[2].numerator / this.exifdata.GPSLongitude[2].denominator;
      var lonDirection = this.exifdata.GPSLongitudeRef;

      var lonFinal = convertDMSToDD(lonDegree, lonMinute, lonSecond, lonDirection);
      setLat(latFinal);
      setLon(lonFinal);
      console.log(lonFinal);
      console.log(latFinal);
    });
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


  return (
    <React.Fragment>
      <Typography className="Retrospective__Title" variant="h3" component="h1">Your past journeys</Typography>
      <div className="Retrospective__Container">
        <div className="Retrospective__Cards">
          <Typography className="Retrospective__NotFound" variant="body1">No journeys found!</Typography>
          <Button variant="contained" color="primary">
            Add new journey
          </Button>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
              isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag 'n' drop some files here, or click to select files</p>
            }
          </div>
        </div>
        <RetrospectiveMap lon={lon} lat={lat}/>
      </div>
    </React.Fragment>
  )
}