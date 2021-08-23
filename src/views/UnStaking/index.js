import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, TextField, Button, Divider } from '@material-ui/core'

import { useWallet } from '../../useWallet'
import { request as req } from '../../req'

import IAlert from '../../components/IAlert'

const useStyles = makeStyles(theme => ({
    icon: {
        background: 'transparent',
        borderRadius: 0,
    },
    iconText: {
        fontWeight: 300,
        marginLeft: theme.spacing(2),
    },
    form: {
        width: '95%',
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
    },

    margin20: {
        marginTop: '20px',
        marginBottom: '20px'
    },
    withdrawButton: {
        // position: 'absolute',
        bottom: '55px'
    },
    header: {
        fontSize: '1.2rem',
        height: '44px',
        'display': 'flex',
        'align-items': 'center'
    },
    headerTitle: {
        width: 'calc(100% - 128px)',
        textAlign: 'center',
    }
}))

const Index = () => {
    const classes = useStyles()
    const { shortAccount, account } = useWallet()
    const [extractableAmount, setExtractableAmount] = useState(0)
    const [openAlert, setopenAlert] = React.useState(false);

    const withdrawAll = async (address) => {
        const url = '/profit/sendPledgeAmount'
        const res = await req.post(url, { address: address })
        setopenAlert(true)
        console.log('res::', res)
    }

    const getExtractableAmount = async (address) => {
        const url = '/profit/getPledgeAmount'
        const res = await req.post(url, { address: address })
        setExtractableAmount(res)
    }

    const handleOpenAlert = () => {
        console.log('handleOpenAlert')
    }
    useEffect(() => {
        getExtractableAmount(account)
    }, [])
    return (
        <div>
            <IAlert show={openAlert} setOpenAlert={ setopenAlert }  />

            <div className={classes.form}>
                <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.margin20}>
                        <div className='staking-box' >
                            <div className='number'>
                                {extractableAmount}
                            </div>
                            <div className='desc'>
                                Extractable Pledge (ADAM)
                            </div>
                        </div>
                        {/* <TextField
                            placeholder="Please enter the withdrawal quantity"
                            variant="outlined"
                            name="message"
                            fullWidth
                        /> */}
                    </Grid>
                    <div className='tips-box'>
                        The pledge will be withdrawn to the address <span className='address'>{shortAccount()}</span>,
                        please pay attention to check it
                    </div>
                    <Grid item container className={classes.withdrawButton}>
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            color="primary"
                            size="large"
                            onClick={e => withdrawAll(account)}
                        >
                            Apply to withdraw pledge
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default Index
