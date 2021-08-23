/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  Typography,
  ListItemIcon,
  Divider,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  listItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  navLink: {
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
  listItemIcon: {
    minWidth: 'auto',
  },
  closeIcon: {
    justifyContent: 'flex-end',
    cursor: 'pointer',
  },
  menu: {
    display: 'flex',
  },
  menuItem: {
    marginRight: theme.spacing(8),
    '&:last-child': {
      marginRight: 0,
    },
  },
  menuGroupItem: {
    paddingTop: 0,
  }, 
  divider: {
    width: '100%',
  },
}));

const SidebarNav = props => {
  const { onClose, className, ...rest } = props;
  const classes = useStyles();

  return (
    <List {...rest} className={clsx(classes.root, className)}>
      <ListItem className={classes.closeIcon} onClick={() => onClose()}>
        <ListItemIcon className={classes.listItemIcon}>
          <CloseIcon fontSize="small" />
        </ListItemIcon>
      </ListItem>
     
      <ListItem className={classes.listItem}>
        <Button
          // fullWidth
          component="a"
          href="#/earnings"
        >
          My Earnings
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          component="a"
          href="#/staking"
        >
          Current Pledge
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          // fullWidth
          component="a"
          href="#/machines"
        >
          My Machines
        </Button>
      </ListItem>
      <ListItem className={clsx(classes.listItem, 'PositionBottom1')}>
        <Button
          fullWidth
          component="a"
          href="#/documentation"
        >
          Machine Details Info
        </Button>
      </ListItem>
      <ListItem className={clsx(classes.listItem, 'PositionBottom')}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          component="a"
          href="/#/addmachine"
        >
          Add New Machine
        </Button>
      </ListItem>
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
};

export default SidebarNav;
