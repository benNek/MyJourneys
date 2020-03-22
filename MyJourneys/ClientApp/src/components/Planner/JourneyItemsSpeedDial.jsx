import React from "react";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SpeedDial from "@material-ui/lab/SpeedDial";
import FlightIcon from '@material-ui/icons/Flight';
import HotelIcon from '@material-ui/icons/Hotel';
import PlaceIcon from '@material-ui/icons/Place';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

export default function JourneyItemsSpeedDial() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const actions = [
    {icon: <PlaceIcon/>, name: 'Place'},
    {icon: <NoteAddIcon/>, name: 'Note'},
    {icon: <HotelIcon/>, name: 'Accommodation'},
    {icon: <FlightIcon/>, name: 'Flight'}
  ];

  return (
    <SpeedDial
      ariaLabel="SpeedDial tooltip example"
      className={"FloatingActionButton"}
      icon={<SpeedDialIcon/>}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {actions.map(action => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={handleClose}
          title={action.name}
        />
      ))}
    </SpeedDial>
  )
}