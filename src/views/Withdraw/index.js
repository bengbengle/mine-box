import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, TextField, Button, Divider } from '@material-ui/core'
import BigNumber from "bignumber.js";
import { useWallet } from '../../useWallet'
import { request as req } from '../../req'
import CountUp from "react-countup";

import IAlert from '../../components/IAlert'

import LoadingModal from '../AddMachine/LoadingModal'

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
        display: 'flex',
        maxWidth: '1236px',
        minWidth: '275px',
        
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
    inputTitle: {
        fontWeight: 700,
        marginLeft: '8px',
        marginBottom: theme.spacing(1),
    },
    margin20: {
        marginTop: '20px',
        marginBottom: '20px'
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
    const { shortAccount, account, get_draw_profit, send_draw_profit } = useWallet()
    const [extractableAmount, setExtractableAmount] = useState(0)
    const [openAlert, setopenAlert] = React.useState(false);
    const [status, setStatus] = React.useState('');
    const [drawstatus, setdrawstatus] = React.useState('');
    const [loading, setloading] = useState(false)

    const withdrawAll = async (address) => {
        let res = await send_draw_profit({setdrawstatus})
        init()
        console.log('withdraw ::::', res)
    }

    const formatNum = (num, precision = 0, dec = 4) => {
        let x = new BigNumber(num);
        let x_div = x.dividedBy(10 ** precision)
        let x_fixed = x_div.toFixed(dec);
        return x_fixed
    }
    const init = async () => {
        let res = await get_draw_profit()
        console.log('get ::::', res)
        setExtractableAmount(formatNum(res, 8))
    }

    useEffect(() => {
        init()
    }, [])


    useEffect(() => {
        if (drawstatus == 'confirm') setloading(true)
        if (drawstatus == 'confirm' || drawstatus == 'pending') {
          setloading(true)
        } else if (drawstatus == 'success') {
            setloading(false)
            // setStatus()
            setStatus('success')
            setopenAlert(true)
        } else if (drawstatus == 'failed') {
            setloading(false)
            setStatus('error')
            setopenAlert(true)
        }
      }, [drawstatus])

    return (
        <div data-aos='fade-up' className='root-content'>
            <IAlert show={openAlert} setOpenAlert={setopenAlert} status={status} />

            <div className={classes.form}>
                <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.margin20}>
                        <div className='staking-box' >
                            <div className='number'>
                                <CountUp start={0} end={extractableAmount} duration="1" decimal='.' decimals={4} separator=',' useGrouping="true" />
                            </div>
                            <div className='desc'>
                                Extractable Earn (ADAM)
                            </div>
                        </div>

                    </Grid>
                    <div className='tips-box'>
                        Your profit will be withdraw to the address <span className='address'>{shortAccount()}</span>,
                        please pay attention to check it
                    </div>
                    <Grid item container >
                        {extractableAmount!=0.0000 ? <Button
                            onClick={e => withdrawAll(account)}
                            fullWidth
                            variant="contained"
                            type="submit"
                            color="primary"
                            size="large"
                            className='bottomBox'
                        > Withdraw {extractableAmount}</Button> :
                            <Button fullWidth variant="contained" type="submit" size="large" className='bottomBox'> 
                                Withdraw
                                {/* {{extractableAmount}} */}
                            </Button>
                        }
                    </Grid>
                </Grid>
            </div>
            <LoadingModal show={loading} handleCloseModal={()=>{}} />
        </div>
    )
}

export default Index
