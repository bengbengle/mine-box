import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles'
import { useWallet } from '../useWallet'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
  

const useStyles = makeStyles(theme => ({
    form: {
        margin: '0px auto',
        border: 'none',
        'border-radius': '30px',
        '& .MuiTextField-root': {
            'border-radius': '30px',
            background: '#303030',
            border: 'none',
        },
        '& .MuiOutlinedInput-input': {
            background: '#303030',
            padding: '13.5px 14px',
            'border-radius': '30px',
            border: 'none',
        },
        '& fieldset': {
            border: 'none',
        },
    }
}))


export default function Index({ show, handleCloseModal }) {
    const classes = useStyles()
    const [poolName, setPoolName ] = useState()
    const [transactionStatus, setTransactionStatus] = useState('') // '' 、confirm 、pengding 、success 、fails  

    const { get_pool_name, set_pool_name } = useWallet()

    const handlePoolName = async e => {
        console.log('handlePoolName:', 'handlePoolName')
        setTransactionStatus('confirm')
        try{
            const tx = await set_pool_name(poolName)
            console.log(tx)
            setTransactionStatus('success')
        } catch(e) {
            setTransactionStatus('failed')
        }
    }

    useEffect(() => {
        if(transactionStatus == 'success') {
            setTransactionStatus('')
            handleCloseModal(false)
        } 
        if(transactionStatus == 'failed') {
            setTransactionStatus('')
        } 
      }, [transactionStatus])
    
    return (
        <div className={classes.form}>
            <Dialog
                open={show}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent style={{
                    'display': 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <DialogTitle id="form-dialog-title">
                        Set Pool Name
                    </DialogTitle>
                    <TextField
                        value={poolName}
                        onChange={e => setPoolName(e.target.value)}
                        autoFocus
                        margin="dense"
                        id="name"
                        fullWidth
                        variant="outlined"
                    />
                    <DialogContentText  >
                        Once the pool name is set, you will not be able to edit.
                    </DialogContentText>
                    <DialogActions style={{width: '100%', marginTop: '30px'}}>
                        {/* <Button
                            onClick={handlePoolName}
                            fullWidth
                            variant="contained"
                            type="submit"
                            color="primary"
                            size="large"
                        >
                            Commit
                        </Button> */}
{
    (transactionStatus == 'confirm') && <Button fullWidth variant="contained" type="submit" size="large"> Waiting Confirm... </Button>
    || (transactionStatus == 'pending') && <Button fullWidth variant="contained" type="submit" size="large"> Pending... </Button>
    || (transactionStatus == '') && <Button fullWidth variant="contained" type="submit" color="primary" size="large" onClick={handlePoolName}>Submit</Button>
    || ''
}
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
}
