import React, { useEffect, useState } from 'react'
import Alert from '@material-ui/lab/Alert';

import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  root: {
    width: '95%',
    margin: '0px auto'
  }
}))

const IAlert = ({show, setOpenAlert, status= 'success'}) => {
    const classes = useStyles()
    console.log(setOpenAlert,'show:', show)
    const handleOpenAlert = ()=> {
        setOpenAlert(false)
    }
    return (
        <Collapse in={show} className={classes.root} >
            <Alert
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={handleOpenAlert}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            >
                { status == 'success' ? 'Success!' : 'Failed!' }
            </Alert>
        </Collapse>
    )
}

IAlert.propTypes = {
     show: PropTypes.bool,
     setOpenAlert: PropTypes.func.isRequired,
  };
  
export default IAlert