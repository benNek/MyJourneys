import React, {Fragment, useContext} from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Switch from "@material-ui/core/Switch";
import {Context} from "../state/store";
import {setDarkMode} from "../state/actions";
import Button from "@material-ui/core/Button";
import AdminSettings from "./AdminSettings";
import {deletePhotos} from "../utils/networkFunctions";
import {toast} from "react-toastify";

const useStyles = makeStyles(theme => ({
  setting: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '12px 0'
  },
  button: {
    float: 'right'
  }
}));

export default function SettingsPage() {
  const classes = useStyles();

  const [state, dispatch] = useContext(Context);
  const {user, darkMode} = state;

  const handleThemeChange = () => {
    setDarkMode(dispatch, !darkMode);
  };
  
  const handleDeletePhotos = () => {
    deletePhotos().then(res => toast.success(res.data)).catch(err => console.error(err));
  };
  
  const isAdmin = user.roles.includes('Admin');
  
  return (
    <Fragment>
      <Typography component="h1" variant="h3">
        Settings
      </Typography>
      <Divider/>
      <div>
        <div className={classes.setting}>
          <Typography variant="body1">Enable dark mode</Typography>
          <Switch
            checked={darkMode}
            onChange={handleThemeChange}
          />
        </div>
        <div className={classes.setting}>
          <Typography variant="body1">Delete all uploaded photos</Typography>
          <Button className={classes.button} variant="outlined" onClick={handleDeletePhotos}>
            Delete
          </Button>
        </div>
      </div>
      {isAdmin && <AdminSettings/>}
    </Fragment>
  )
}