import React, {useContext, useState} from "react";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Fade from "@material-ui/core/Fade";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import {Form, Formik} from "formik";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {login, updateBearerToken} from "../../utils/networkFunctions";
import {toast} from 'react-toastify';
import {parseUser} from "../../utils/auth";
import {Context} from "../../state/store";
import {setUser} from "../../state/actions";
import {loginValidation} from "../../utils/validation";

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2, 4, 3)
  },
  heading: {
    marginBottom: '32px',
  },
  submitButton: {
    marginTop: '16px',
    width: '100%',
  },
}));

export default function Login() {
  const dispatch = useContext(Context)[1];
  
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Login</Button>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={`${classes.paper} login__modal`}>
            <Typography className={classes.heading} variant="h5" component="h5">
              Sign in to access all the features!
            </Typography>
            <Formik
              initialValues={{username: '', password: ''}}
              validationSchema={loginValidation}
              onSubmit={async (values, actions) => {
                actions.setSubmitting(true);
                await login(values)
                  .then(response => {
                    localStorage.setItem('accessToken', response.data);
                    updateBearerToken();
                    setUser(dispatch, parseUser());
                    toast.success("You have login successfully!");
                  })
                  .catch(err => {
                    toast.error(`${err.response.data} Status code: ${err.response.status}`);
                    actions.setSubmitting(false);
                  });

              }}
            >
              {(formProps) => {
                const {handleChange, setFieldTouched, touched, errors, values} = formProps;
                const change = (name, e) => {
                  e.persist();
                  handleChange(e);
                  setFieldTouched(name, true, false);
                };
                return (
                  <Form className={classes.form}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          autoComplete="fname"
                          name="username"
                          variant="outlined"
                          required
                          fullWidth
                          id="username"
                          label="Username"
                          autoFocus
                          value={values['username']}
                          error={errors.username && touched.username}
                          helperText={(errors.username && touched.username) && errors.username}
                          onChange={change.bind(null, "username")}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                          value={values['password']}
                          error={errors.password && touched.password}
                          helperText={(errors.password && touched.password) && errors.password}
                          onChange={change.bind(null, "password")}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submitButton}
                    >
                      Login
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Fade>
      </Modal>
    </React.Fragment>
  )

}