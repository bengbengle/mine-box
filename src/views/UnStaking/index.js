import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button } from '@material-ui/core'
import { useWallet } from '../../useWallet'
import { request as req } from '../../req'
import BigNumber from "bignumber.js";
import IAlert from '../../components/IAlert'
import CountUp from "react-countup";

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
    const { shortAccount, account } = useWallet()
    const [extractableAmount, setExtractableAmount] = useState(0)
    const [openAlert, setopenAlert] = React.useState(false);

    const unstakingAll = async (address) => {
        const url = '/miner/drawAmount'
        const res = await req.post(url, { address: address })
        setopenAlert(true)
        
        setTimeout(() => {
            getStakingAmount(account)
        }, 800);
    }
  
    const formatNum = (num, precision = 0, dec = 4) => {
        let x = new BigNumber(num);
        let x_div = x.dividedBy(10 ** precision)
        let x_fixed = x_div.toFixed(dec);
        return x_fixed
    }

    const getStakingAmount = async (address) => {
        const url = '/miner/getDrawAmount'
        const res = await req.post(url, { address: address })
        const total_adam = res&& res.total_adam
        setExtractableAmount(total_adam)
    }
 
    useEffect(() => {
        getStakingAmount(account)
    }, [])
    return (
        <div data-aos='fade-up' className='root-content'>
            <IAlert show={openAlert} setOpenAlert={setopenAlert} />
            <div className={classes.form}>
                <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.margin20}>
                        <div className='staking-box' >
                            <div className='number'>
                                <CountUp start={0} end={formatNum(extractableAmount, 8)} duration="1" decimal='.' decimals={4} separator=',' useGrouping="true" />
                            </div>
                            <div className='desc'>
                                Extractable Pledge (ADAM)
                            </div>
                        </div>
                    </Grid>
                    <div className='tips-box'>
                        The pledge will be withdrawn to the address <span className='address'>{shortAccount()}</span>,
                        please pay attention to check it
                    </div>
                    <Grid item container >
                        {extractableAmount ? <Button
                            fullWidth
                            className={'bottomBox'}
                            variant="contained"
                            type="submit"
                            color="primary"
                            size="large"
                            onClick={e => unstakingAll(account)}
                        >
                            Withdraw pledge
                        </Button>
                            :
                            <Button
                            className={'bottomBox'}
                                fullWidth
                                variant="contained"
                                type="submit"
                                size="large"
                            >
                                Withdraw pledge
                            </Button>
                        }
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default Index
