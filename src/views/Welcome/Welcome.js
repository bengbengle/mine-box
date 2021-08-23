import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  main: {
    backgroundColor: '#252525'
  },
  welcomebg: {
    width: 'auto',
    height: '100vh',
    background: 'url(assets/welcome_bg.png)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    [theme.breakpoints.up('sm')]: {
      marginLeft: '10px',
      maxWidth: '600px',
      backgroundColor: '#000fff'
    }
  },
  title: {
    fontWeight: '800',
    color: '#FFFFFF',
    fontSize: '3.2rem',
    position: 'absolute',
    bottom: '23%',
    left: '10%',
    maxWidth: '20rem'
  },
  subtitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#FFFFFF',
    position: 'absolute',
    bottom: '7%',
    left: '10%',
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  },
  arrow: {
    width: '2.3rem',
    height: '2.3rem',
    background: 'url(assets/arrow.png)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    marginLeft: '10px'
  }
}));

const Startup = () => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.welcomebg} data-aos="fade-up">
          <div className={classes.title}>
            Wide area mining
          </div>
          <a href={'/home'} title={'item.title'}>
            <div className={classes.subtitle}>
                Start mining
                <div className={classes.arrow} ></div>
            </div>
          </a>
      </div>
    </div>
  );
};

export default Startup;
