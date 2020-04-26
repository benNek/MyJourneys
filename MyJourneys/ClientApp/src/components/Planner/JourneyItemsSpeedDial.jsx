import React, {useState} from "react";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SpeedDial from "@material-ui/lab/SpeedDial";
import FlightIcon from '@material-ui/icons/Flight';
import HotelIcon from '@material-ui/icons/Hotel';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import EventIcon from '@material-ui/icons/Event';
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Fade from "@material-ui/core/Fade";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FlightItemForm from "./Forms/FlightItemForm";
import HotelItemForm from "./Forms/HotelItemForm";
import ReservationItemForm from "./Forms/ReservationItemForm";
import EventItemForm from "./Forms/EventItemForm";

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function JourneyItemsSpeedDial(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(undefined);
  const {journey, onItemAdd} = props;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleItemAdd = data => {
    onItemAdd(data);
  };

  const handleModalOpen = (form) => {
    handleClose();
    setForm(form);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const actions = [
    {
      icon: <RestaurantIcon/>,
      name: 'Reservation',
      form: <ReservationItemForm journey={journey} onSubmit={handleModalClose} onSuccess={handleItemAdd}/>
    },
    {
      icon: <EventIcon/>,
      name: 'Event',
      form: <EventItemForm journey={journey} onSubmit={handleModalClose} onSuccess={handleItemAdd}/>
    },
    {
      icon: <HotelIcon/>,
      name: 'Hotel',
      form: <HotelItemForm journey={journey} onSubmit={handleModalClose} onSuccess={handleItemAdd}/>
    },
    {
      icon: <FlightIcon/>,
      name: 'Flight',
      form: <FlightItemForm journey={journey} onSubmit={handleModalClose} onSuccess={handleItemAdd}/>
    }
  ];

  return (
    <React.Fragment>
      <SpeedDial
        ariaLabel="Itinerary items setup"
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
            onClick={() => handleModalOpen(action.form)}
            title={action.name}
          />
        ))}
      </SpeedDial>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modalOpen}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <div className={classes.paper}>
            {form}
          </div>
        </Fade>
      </Modal>
    </React.Fragment>
  )
}