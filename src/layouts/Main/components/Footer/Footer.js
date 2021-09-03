import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
// import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  BottomNavigation,
  BottomNavigationAction
} from '@material-ui/core';
 
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: '0px',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    }
  }
}));


const Tab1 = () => <img src='/assets/tab1.png' width='28px' height='28px' />
const Tab2 = () => <img src='/assets/tab2.png' width='28px' height='28px' />
const Tab3 = () => <img src='/assets/tab3.png' width='28px' height='28px' />

const Tab1Active = () => <img src='/assets/tab1-active.png' width='28px' height='28px' />
const Tab2Active = () => <img src='/assets/tab2-active.png' width='28px' height='28px' />
const Tab3Active = () => <img src='/assets/tab3-active.png' width='28px' height='28px' />



const Footer = ({ tabIndex, setTabIndex }) => {
  const history = useHistory();
  const classes = useStyles();
  console.log('value:', tabIndex);
  
  return (
    <BottomNavigation
      value={tabIndex}
      onChange={(event, newValue) => {
        if(tabIndex == newValue && history.location.pathname == '/') return false;
        console.log('onchange...', newValue)
        setTabIndex(newValue + '')
        history.push('/')
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Machine" icon={tabIndex == '0' ? <Tab1Active /> : <Tab1 />} />
      <BottomNavigationAction label="Pledge" icon={tabIndex == '1' ? <Tab2Active /> : <Tab2 />} />
      <BottomNavigationAction label="Profit" icon={tabIndex == '2' ? <Tab3Active /> : <Tab3 />} />
    </BottomNavigation>
  )
}
Footer.propTypes = {
  className: PropTypes.string,
  tabIndex: PropTypes.string,
  setTabIndex: PropTypes.func
};

export default Footer;