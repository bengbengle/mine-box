import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(() => ({
    loadingCls: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }))

const RefreshIcon = props => <img src='/assets/refresh.png' />
const SuccessIcon = () => <img src='/assets/success.png' style={{ 
    width: '127px',
    height: '92px',
    margin: '20px auto',
    display: 'flex'
 }} />


export default function Index({ show, handleCloseModal }) {
    const classes = useStyles();

    return (
        <div>
            <Dialog
                open={show}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent style={{
                    'display': 'flex',
                    'flex-direction': 'column',
                    'justify-content': 'center',
                    'align-items': 'center'
                }}>
                    <div className={clsx(classes.loadingCls, 'loading')} ><RefreshIcon /></div>
                    <DialogContentText id="alert-dialog-slide-description" style={{'text-align': 'center' }}>
                        Loading
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}
