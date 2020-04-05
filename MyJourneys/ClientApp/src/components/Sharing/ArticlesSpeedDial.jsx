import React, {useState} from "react";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SpeedDial from "@material-ui/lab/SpeedDial";
import TimelineIcon from '@material-ui/icons/Timeline';
import SubjectIcon from '@material-ui/icons/Subject';
import {useHistory} from "react-router";

export default function ArticlesSpeedDial() {
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const actions = [
    {
      icon: <SubjectIcon/>,
      name: 'Blog',
      url: '/blog'
    },
    {
      icon: <TimelineIcon/>,
      name: 'Day plan',
      url: '/day-plan'
    },
  ];

  return (
    <React.Fragment>
      <SpeedDial
        ariaLabel="Articles"
        className="FloatingActionButton"
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
            onClick={() => history.push(action.url)}
            title={action.name}
          />
        ))}
      </SpeedDial>
    </React.Fragment>
  )
}