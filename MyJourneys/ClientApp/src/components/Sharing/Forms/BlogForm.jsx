import React, {createRef, useEffect, useState} from "react";
import {Form, Formik} from "formik";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Editor from "rich-markdown-editor";
import Icon from "@material-ui/core/Icon";
import {toast} from 'react-toastify';
import {createBlog, getTags} from "../../../utils/networkFunctions";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from "@material-ui/core/Chip";
import {blogValidation} from "../../../utils/validation";
import Popover from "@material-ui/core/Popover";
import removeMd from "remove-markdown";

const useStyles = makeStyles(theme => ({
  submitButton: {
    marginTop: '16px',
    width: '120px',
  },
}));

export default function BlogForm() {
  const classes = useStyles();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getTags().then(res => setTags(res.data)).catch(err => console.error(err));
  }, []);
  
  const editorRef = createRef();

  const handleOpenPopover = element => {
    setAnchorEl(element);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Typography component='h1' variant='h3'>
        Add your own blog
      </Typography>
      <Divider/>
      <Formik
        initialValues={{title: '', tags: [], text: ' '}}
        validationSchema={blogValidation}
        onSubmit={async (values, actions) => {
          if (!isSubmitting) {
            return;
          }
          
          const strippedText = removeMd(values['text']).replace('\\', '').trim();
          if (!strippedText) {
            handleOpenPopover(editorRef.current.element);
            return;
          }
          
          actions.setSubmitting(true);
          await createBlog(values)
            .then(response => {
              toast.success(response.data);
            })
            .catch(err => {
              toast.error(`${err.response.data} Status code: ${err.response.status}`);
              actions.setSubmitting(false);
            });
          setIsSubmitting(false);
        }}
      >
        {(formProps) => {
          const {handleChange, setFieldTouched, setFieldValue, errors, touched} = formProps;
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
                    error={errors.title && touched.title}
                    helperText={(errors.title && touched.title) && errors.title}
                    onChange={change.bind(null, "title")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="tags"
                    options={tags.map((option) => option)}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({index})} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Tags"/>
                    )}
                    onChange={(event, values) => setFieldValue('tags', values)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Editor
                    ref={editorRef}
                    bodyPlaceholder="Express your thoughts in here!"
                    onChange={value => setFieldValue('text', value())}
                  />
                  <Popover
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClosePopover}
                  >
                    You must enter text!
                  </Popover>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="default"
                className={classes.submitButton}
                endIcon={<Icon>send</Icon>}
                onClick={() => setIsSubmitting(true)}
              >
                Submit
              </Button>
            </Form>
          );
        }}
      </Formik>
    </React.Fragment>
  )
}
