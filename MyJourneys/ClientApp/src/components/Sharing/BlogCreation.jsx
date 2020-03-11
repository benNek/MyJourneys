import React, {useContext, useState} from "react";
import {Form, Formik} from "formik";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Editor from "rich-markdown-editor";
import _ from "lodash";
import Icon from "@material-ui/core/Icon";
import {createBlog} from "../../utils/networkFunctions";
import {toast} from 'react-toastify';
import {UserContext} from "../../contexts/userContext";

const useStyles = makeStyles(theme => ({
  submitButton: {
    marginTop: '16px',
    width: '120px',
  },
}));

export default function BlogCreation() {
  const {user} = useContext(UserContext);
  
  const classes = useStyles();
  
  const [text, setText] = useState("");

  const handleEditorChange = _.debounce(value => {
    setText(value());
  }, 250);

  return (
    <div>
      <Formik
        initialValues={{title: ''}}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          values['text'] = text;
          values['authorId'] = user.id;
          await createBlog(values)
            .then(response => {
              console.log(response)
            })
            .catch(err => {
              toast.error(`${err.response.data} Status code: ${err.response.status}`);
              actions.setSubmitting(false);
            });

        }}
      >
        {(formProps) => {
          const {handleChange, setFieldTouched} = formProps;
          const change = (name, e) => {
            e.persist();
            handleChange(e);
            setFieldTouched(name, true, false);
          };
          return (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    name="title"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    autoFocus
                    onChange={change.bind(null, "title")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Editor
                    bodyPlaceholder="Express your thoughts in here!"
                    onChange={handleEditorChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="default"
                className={classes.submitButton}
                endIcon={<Icon>send</Icon>}
              >
                Submit
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  )
}
