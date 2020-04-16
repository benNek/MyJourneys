import React, {useContext} from 'react';

import Button from "@material-ui/core/Button";
import {toast} from "react-toastify";
import {logout} from "../../utils/networkFunctions";
import {Context} from "../../state/store";
import {setUser} from "../../state/actions";

export default function Logout() {
  const dispatch = useContext(Context)[1];

  const handleLogout = async () => {
    await logout()
      .then(() => {
        localStorage.removeItem('accessToken');
        setUser(dispatch, null);
      })
      .catch(err => {
        toast.error(`${err.response.data} Status code: ${err.response.status}`);
      });
  };

  return (
    <Button onClick={handleLogout}>Logout</Button>
  )
}