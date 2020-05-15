import React, {createRef, useContext, useEffect, useState} from "react";
import {Form, Formik} from "formik";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Editor from "rich-markdown-editor";
import Icon from "@material-ui/core/Icon";
import {toast} from 'react-toastify';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from "@material-ui/core/Chip";
import Popover from "@material-ui/core/Popover";
import removeMd from "remove-markdown";
import {createArticle, editArticle, getTags} from "../../utils/networkFunctions";
import {articleValidation} from "../../utils/validation";
import {Context} from "../../state/store";
import Success from "../Success";
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import RecommendedAction from "../RecommendedAction";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles(theme => ({
  card: {
    overflow: 'initial'
  },
  successContainer: {
    textAlign: 'center'
  },
  submitButton: {
    marginTop: '16px',
    width: '120px',
  },
  link: {
    color: theme.palette.info.dark
  },
  recommendedActionsTitle: {
    marginTop: '24px'
  },
  recommendedActions: {
    marginTop: '0px'
  }
}));

export default function ArticleForm(props) {
  const {location} = props;
  const editingArticle = location && location.state && location.state.article;
  const classes = useStyles();

  const [state] = useContext(Context);
  const {darkMode} = state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tags, setTags] = useState([]);
  const [createdId, setCreatedId] = useState(0);
  const [success, setSuccess] = useState(false);

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

  if (success) {
    return (
      <div className={classes.successContainer}>
        <Success/>
        <Typography component='h1' variant='h4'>
          {editingArticle ? "Article updates successfully!" : "Article published successfully!"}
        </Typography>
        <Typography variant='subtitle1' className={classes.recommendedActionsTitle}>
          Recommended actions:
        </Typography>
        <Grid container spacing={4} className={classes.recommendedActions}>
          <Grid item xs={12} sm={6} md={4}>
            <RecommendedAction Icon={VisibilityOutlinedIcon} text="Preview article" link={`/articles/${createdId}`}/>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RecommendedAction Icon={SpeakerNotesIcon} text="All articles" link='/articles'/>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RecommendedAction Icon={CreateOutlinedIcon} text="Publish another article" link='/article'/>
          </Grid>
        </Grid>
      </div>
    )
  }

  const initialValues = {
    title: editingArticle ? editingArticle.title : '',
    tags: editingArticle ? editingArticle.tags : [],
    text: editingArticle ? editingArticle.text : ''
  };

  return (
    <Card className={classes.card} variant="outlined">
      <CardContent>
        <Typography component='h1' variant='h3'>
          {editingArticle ? "Edit your article" : "Publish your article"}
        </Typography>
        <Divider/>
        <Formik
          initialValues={initialValues}
          validationSchema={articleValidation}
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
            if (editingArticle) {
              await editArticle(editingArticle.id, values)
                .then(response => {
                  setCreatedId(response.data.id);
                  setSuccess(true);
                })
                .catch(err => {
                  toast.error(`${err.response.data} Status code: ${err.response.status}`);
                  actions.setSubmitting(false);
                });
            } else {
              await createArticle(values)
                .then(response => {
                  setCreatedId(response.data.id);
                  setSuccess(true);
                })
                .catch(err => {
                  toast.error(`${err.response.data} Status code: ${err.response.status}`);
                  actions.setSubmitting(false);
                });
            }
            setIsSubmitting(false);
          }}
        >
          {(formProps) => {
            const {handleChange, setFieldTouched, setFieldValue, errors, touched, values} = formProps;
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
                      value={values['title']}
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
                      value={values['tags']}
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
                      defaultValue={values['text']}
                      bodyPlaceholder="Express your thoughts in here!"
                      onChange={value => setFieldValue('text', value())}
                      dark={darkMode}
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
      </CardContent>
    </Card>
  )
}
