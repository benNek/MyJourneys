import React, {Fragment, useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {approveAuthor, blockAuthor, getAuthorArticles, getUnapprovedAuthors} from "../utils/networkFunctions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {deepPurple, green, red} from "@material-ui/core/colors";
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextTruncate from "react-text-truncate";
import removeMd from "remove-markdown";

const useStyles = makeStyles(theme => ({
  title: {
    marginTop: '36px'
  },
  subtitle: {
    marginBottom: '12px'
  },
  avatar: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  approve: {
    color: green[500],
    cursor: 'pointer',
    marginLeft: '12px'
  },
  block: {
    color: red[500],
    cursor: 'pointer'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2),
    maxWidth: '80%',
    maxHeight: '80vh'
  }
}));

export default function AdminSettings() {
  const classes = useStyles();

  const [authors, setAuthors] = useState([]);
  const [articles, setArticles] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    getUnapprovedAuthors().then(res => setAuthors(res.data)).catch(err => console.error(err));
  }, []);

  const handleShowArticles = name => {
    getAuthorArticles(name).then(res => {
      setArticles(res.data);
      setPreviewOpen(true);
    }).catch(err => console.error(err));
  };

  const handleApprove = name => {
    approveAuthor(name).then(res => setAuthors(authors.filter(author => author !== res.data))).catch(err => console.error(err));
  };

  const handleBlock = name => {
    blockAuthor(name).then(res => setAuthors(authors.filter(author => author !== res.data))).catch(err => console.error(err));
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const renderUnapprovedAuthors = () => {
    if (!authors.length) {
      return (
        <Typography variant="body1">
          No unapproved authors were found.
        </Typography>
      )
    }
    
    return (
      <List className={classes.root}>
        <Typography variant="h5" className={classes.subtitle}>
          Unapproved authors:
        </Typography>
        {authors.map(author => (
          <ListItem onClick={() => handleShowArticles(author)} key={author} button>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>{author[0].toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={author}/>
            <ListItemSecondaryAction>
              <BlockIcon onClick={() => handleBlock(author)} className={classes.block}/>
              <CheckIcon onClick={() => handleApprove(author)} className={classes.approve}/>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    )
  };

  const renderPreviews = () => {
    if (!articles.length) {
      return (<Fragment/>)
    }

    return articles.map(article =>
      <Card key={article.id} className={classes.card} variant="outlined">
        <CardContent>
          <Typography variant="h6">
            {article.title}
          </Typography>
          <Typography variant="body2">
            <TextTruncate
              line={6}
              element="span"
              truncateText="…"
              text={removeMd(article.text).replace('\\', '')}
            />
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Fragment>
      <Typography component="h2" variant="h3" className={classes.title}>
        Admin settings
      </Typography>
      <Divider/>
      {renderUnapprovedAuthors()}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={previewOpen}
        onClose={handlePreviewClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={previewOpen}>
          <div className={classes.paper}>
            {renderPreviews()}
          </div>
        </Fade>
      </Modal>
    </Fragment>
  )
}