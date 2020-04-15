import React from 'react';
import './Retrospective.css';
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import {useHistory} from "react-router";
import RetrospectiveMap from "./RetrospectiveMap";

export default function Retrospective() {
  const history = useHistory();

  return (
    <React.Fragment>
      <div className="map__container">
        <RetrospectiveMap/>
      </div>
      <Fab onClick={() => history.push('/upload')} aria-label="add photos" className="FloatingActionButton">
        <AddPhotoAlternateIcon/>
      </Fab>
    </React.Fragment>
  )
}