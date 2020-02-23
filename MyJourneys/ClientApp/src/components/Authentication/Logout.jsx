import React, {useContext} from 'react';

import Button from "@material-ui/core/Button";
import {UserContext} from "../../contexts/userContext";
import {toast} from "react-toastify";
import {logout} from "../../utils/networkFunctions";

export default function Logout() {

  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    await logout()
      .then(() => {
        localStorage.removeItem('accessToken');
        setUser(null);
      })
      .catch(err => {
        toast.error(`${err.response.data} Status code: ${err.response.status}`);
      });
  };
  
  return (
    <Button color="inherit" onClick={handleLogout}>Logout</Button>
  )
}