import React, { useEffect, useState } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Typography, TextField, Button, InputAdornment } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { useWallet } from '../../useWallet'
import { request as req } from '../../req'
import SuccessModal from './SuccessModal'
import FailedModal from './FailedModal'
import clsx from 'clsx';
import BigNumber from "bignumber.js";

const useStyles = makeStyles(theme => ({
  icon: {
    background: 'transparent',
    borderRadius: 0,
  },
  machineHeader: {
    height: '44px',
    display: 'flex',
    'align-items': 'center',
    flex: '1',
    fontSize: '1.2rem'
  },
  machineHeaderTitle: {
    width: 'calc(100% - 128px)',
    'text-align': 'center',
  },
  machineBody: {
    '& .MuiTextField-root': {
      background: theme.palette.background.paper,
    },
    '& .MuiOutlinedInput-input': {
      background: '#303030',
      padding: '13.5px 14px',
      borderRadius: '15px'
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

  machineItem: {
    'font-weight': '300',
    color: 'white',
    width: '95%',
    height: '45px',
    margin: '0px auto',
    background: '#FF6B22',
    padding: '2.5%',
  }
}));

const HelpIcon = () => <img src='/assets/help.png' style={{ marginLeft: '10px', width: '1rem', height: '1rem' }} />

const AddMachine = props => {
  const classes = useStyles();
  const { add_machine, approval, get_allowance, connectWallet, availPledage } = useWallet()

  const [active, setActive] = useState(0)
  const [totalPower, setTotalPower] = useState(0)
  const [availabelPower, setAvailabelPower] = useState(0)
  const [minerNo, setMinerNo] = useState('')

  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)

  const [amount, setAmount] = useState(30)

  const [approvestatus, setApprovestatus] = useState('')
  const [transactionStatus, setTransactionStatus] = useState('') // '' 、confirm 、pengding 、success 、fails  

  const [poolCode, setPoolCode] = useState('')
  // device id
  const [devId, setDevId] = useState('')
  // const tmpdevId = 'ec24c456-b7cd-6aa9-eb33-e2cc89b3228c'
  
  // device id
  const [forbidden, setForbidden] = useState(0)

  const [pledgePower, setPledgePower] = useState(1)

  // 获取算力 
  const getMinerInfo = async (id) => {
    console.log('getMinerInfo', id)
    let url = 'miner/getMinerPledgePower'
    const data = { serialNumber: id }
    const res = await req.post(url, data)

    // total_power：实际空间算力
    // power：剩余可用算力
    const available_power = res && res.power || 0
    const total_power = res && res.total_power || 0

    // minerNo
    {
      let url2 = 'miner/getMinerNo'
      const minerNo = await req.post(url2, { serialNumber: id })
      setMinerNo(minerNo)
    }

    setTotalPower(total_power)
    setAvailabelPower(available_power)
  }

  // 获取是否已授权
  const getAllowance = async () => {
    get_allowance()
      .then(
        allowance => {
          allowance != '0' && setApprovestatus('success')
        }
      )
  }
 
  
  const handlePledgeChange = async (val) => {
    let v = val.replace(/^(0+)|[^\d]+/g,'')
    setPledgePower(v)
    let adam_num = parseFloat(v) * 30
    setAmount(adam_num)

    await get_avail_pledage({power: v})
  }

  const handleCloseModal = () => {
    setSuccess(false)
    setFailed(false)
    setTransactionStatus('')
  }
  // device Id changed
  const handleDeviceChanged = async (id) => {
    console.log('id::', id)
    setDevId(id)
    getMinerInfo(id)
  }

  // pool code changed
  const handlePoolCodeChanged = async (val) => {
    setPoolCode(val)
  }

  const get_avail_pledage = async ({power}) => {
    let val = await availPledage({power})
    console.log('availPledage::', val)
    setForbidden(val)
  }

  useEffect(() => {
    getAllowance()
    // get_avail_pledage()
  }, [])

  useEffect(() => {
    if (transactionStatus == 'success') setSuccess(true)
    if (transactionStatus == 'failed') setFailed(true)
  }, [transactionStatus])

  const formatNum = (num, dec = 4) => {
    let x = new BigNumber(num);
    let x_str = x.toFixed(dec);
    return x_str
  }

  const approve = async () => {
    approval({ setApprovestatus })
  }

  const addMachine = async () => {
    setTransactionStatus('confirm')
    const cycle = active == 0 ? 360 : active == 1 ? 540 : 1080
    try {
      const orderid = await req.post('miner/getOrderId')
      console.log('orderid::', orderid)

      const web3 = await connectWallet()
      let amount_wei = web3.utils.toWei((amount * 100).toString(), 'mwei')
      
      console.log({ cycle, minerNo, orderId: orderid, devId: devId, poolCode, amount: amount_wei, pledgePower, setTransactionStatus })

      const tx = await add_machine({ cycle, minerNo, orderId: orderid, devId: devId, poolCode, amount: amount_wei, pledgePower, setTransactionStatus })
      
      console.log('tx::', tx)
      getMinerInfo(devId)
      // get_avail_pledage()

    } catch (e) {
      setTransactionStatus('fails')
      console.log(e)
    }
  }
  return (
    <div >
      <div className={clsx('machine-content', classes.machineBody) }>
        <Grid container spacing={2}>
          <Grid item xs={12} >
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Pool Code
            </Typography>
            <TextField
              placeholder="Please enter the live paste mining pool code"
              variant="outlined"
              size="medium"
              name="code"
              fullWidth
              type="text"
              onChange={e => handlePoolCodeChanged(e.target.value)}
              value={poolCode}
            />
          </Grid>

          <Grid item xs={12} style={{ marginBottom: '30px' }}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Machine ID
            </Typography>
            <TextField
              onChange={e => handleDeviceChanged(e.target.value)}
              placeholder="Input the Mining Machine ID"
              variant="outlined"
              size="medium"
              name="id"
              fullWidth
              type="text"
              value={devId}
            />
          </Grid>
          <Grid item xs={12} >
            <div className={classes.machineItem} style={{
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px'
            }}>
              <div className={'machine-item'}>
                <div className='machine-item-label'>
                  Total Storage Power
                  <HelpIcon />
                </div>
                <div className='machine-item-value'>
                  {formatNum(totalPower) || '0.0000'} T
                </div>
              </div>
            </div>
            <div className={classes.machineItem} style={{
              borderBottomRightRadius: '10px',
              borderBottomLeftRadius: '10px'
            }} >
              <div className={'machine-item'}>
                <div className='machine-item-label'>
                  Available Storage Power
                  <HelpIcon />
                </div>
                <div className='machine-item-value'>
                  {
                    formatNum(availabelPower) || '0.0000'
                  } T
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} className={classes.margin20} style={{ marginTop: '30px' }}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
            >
              Pledge 
            </Typography>
            <span className='subtitle5'>
              (1T Storage Power needs to pledge 30 ADAM)
            </span>
            <TextField
              placeholder="Please enter the pledge power (T)"
              variant="outlined"
              name="message"
              fullWidth
              onChange={e => handlePledgeChange(e.target.value)}
              value={pledgePower}
              endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
              aria-describedby="standard-weight-helper-text"
              inputProps={{
                'aria-label': 'T',
              }}
            />
            <span className='subtitle5'>
              Expected pledge { amount } ADAM 
            </span>
          </Grid>
          <Grid item xs={12} className='cycle-list'>
            <div className={active == 0 ? clsx('cycle-item', 'cycle-item-actve') : 'cycle-item'} onClick={e => setActive(0)}>
              <div className='cycle-item-title'>Pledge Cycle</div>
              <div className='cycle-item-value'>360 DAY</div>
            </div>

            <div className={active == 1 ? clsx('cycle-item', 'cycle-item-actve') : 'cycle-item'} onClick={e => setActive(1)}>
              <div className='cycle-item-title'>Pledge cycle</div>
              <div className='cycle-item-value'>540 DAY</div>
            </div>

            <div className={active == 2 ? clsx('cycle-item', 'cycle-item-actve') : 'cycle-item'} onClick={e => setActive(2)}>
              <div className='cycle-item-title'>Pledge cycle</div>
              <div className='cycle-item-value'>1080 DAY</div>
            </div>
          </Grid>
          
          <Grid item container xs={12} className='addmachineButton'>
            {
              forbidden == 1 ?  
              <Button variant="contained" type="submit" size="large" className={'bottomBox'}>  
                Number of new spaces waiting to be opened
              </Button>
              : 
              (parseFloat(availabelPower) < parseFloat(pledgePower)) ? 
                <Button variant="contained" type="submit" size="large" className={'bottomBox'}>  
                  Not enough availabel power
                </Button> :
              (
                (!poolCode || !minerNo || !devId || !pledgePower  ) ?
                  <Button variant="contained" type="submit" size="large" className={'bottomBox'}>  
                    Invalid pool code or machine id  
                  </Button>
                  :
                  (
                    approvestatus == 'success' ?
                    (transactionStatus == 'confirm') && <Button  className={'bottomBox'} variant="contained" type="submit" size="large"> Waiting Confirm... </Button>
                    || (transactionStatus == 'pending') && <Button  className={'bottomBox'} variant="contained" type="submit" size="large"> Pending... </Button>
                    || (transactionStatus == '') && <Button  className={'bottomBox'} variant="contained" type="submit" color="primary" size="large" onClick={addMachine}>
                      Staking Now
                    </Button>
                    || ''
                    : (approvestatus == 'confirm') && <Button  className={'bottomBox'} variant="contained" type="submit" size="large"> Waiting Confirm... </Button>
                    || (approvestatus == 'pending') && <Button  className={'bottomBox'} variant="contained" type="submit" size="large"> pending... </Button>
                    || <Button className={'bottomBox'} variant="contained" type="submit" size="large" color="primary" onClick={approve} >
                          {'Approve'}
                        </Button>
                  )
              )
            }
          </Grid>
        </Grid>

        <SuccessModal show={success} handleCloseModal={handleCloseModal} />
        <FailedModal show={failed} handleCloseModal={handleCloseModal} />
      </div>
    </div>
  );
};

export default AddMachine;
