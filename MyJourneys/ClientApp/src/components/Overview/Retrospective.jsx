import React, {useEffect, useState} from 'react';
import './Retrospective.css';
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import {useHistory} from "react-router";
import RetrospectiveMap from "./RetrospectiveMap";
import {getVisitedCountries} from "../../utils/networkFunctions";

export default function Retrospective() {
  const history = useHistory();

  const [countries, setCountries] = useState([]);
  useEffect(() => {
    getVisitedCountries().then(res => setCountries(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <React.Fragment>
      <div className="map__container">
        <RetrospectiveMap countries={countries}/>
      </div>
      <Fab onClick={() => history.push('/upload')} aria-label="add photos" className="FloatingActionButton">
        <AddPhotoAlternateIcon/>
      </Fab>
    </React.Fragment>
  )
}