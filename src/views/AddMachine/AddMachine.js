import React, { useEffect, useState } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { useWallet } from '../../useWallet'
import { request as req } from '../../req'
import SuccessModal from './SuccessModal'
import FailedModal from './FailedModal'
import clsx from 'clsx';

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
    width: '95%',
    margin: '0px auto',
    marginTop: '2rem',

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
  const { add_machine, approval, get_allowance, connectWallet } = useWallet()

  const [active, setActive] = useState(0)
  const [totalPower, setTotalPower] = useState(0)
  const [availabelPower, setAvailabelPower] = useState(0)
  const [orderId, setOrderId] = useState('')
  const [minerNo, setMinerNo] = useState('')

  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)

  const [amount, setAmount] = useState(30)

  const [approvestatus, setApprovestatus] = useState('')
  const [transactionStatus, setTransactionStatus] = useState('') // '' 、confirm 、pengding 、success 、fails  

  const [poolCode, setPoolCode] = useState('p12345678')
  const [pledgePower, setPledgePower] = useState(1)

  const [devId, setDevId] = useState('ec24c456-b7cd-6aa9-eb33-e2cc89b3228b') // device id
  const tmpdevId = 'ec24c456-b7cd-6aa9-eb33-e2cc89b3228c'

  // 获取算力 
  const getPower = async () => {
    let totalpower, usedpower
    {
      // 总算力
      const url = '/miner/getMinerInfo'
      const data = {
        serialNumber: devId
      }
      const res = await req.post(url, data)
      totalpower = res.disk_size
    }

    // 实际使用算力
    {
      let url = 'miner/getMinerPledgePower'
      const data = { serialNumber: devId }
      const res = await req.post(url, data)
      usedpower = res || 0
    }
    let total = parseFloat(totalpower || 0)
    let used = parseFloat(usedpower || 0)
    let power = total - used

    // orderId
    {
      let url = 'miner/getOrderId'
      const orderid = await req.post(url)
      setOrderId(orderid)
    }

    // minerNo
    {
      let url = 'miner/getMinerNo'
      const minerNo = await req.post(url, { serialNumber: devId })
      setMinerNo(minerNo)
    }
    setTotalPower(totalpower)
    setAvailabelPower(power)
  }

  const getAllowance = async () => {
    get_allowance()
      .then(
        allowance => {
          allowance != '0' && setApprovestatus('success')
        }
      )
  }

  const handleAmountChange = async (val) => {
    setAmount(val)
    let pledge = parseFloat(val) / 30
    setPledgePower(pledge)
  }

  const handleCloseModal = () => {
    setSuccess(false)
    setFailed(false)
    setTransactionStatus('')
  }

  useEffect(() => {
    getAllowance()
    getPower()
  }, [])

  useEffect(() => {
    if (transactionStatus == 'success') setSuccess(true)
    if (transactionStatus == 'failed') setFailed(true)
  }, [transactionStatus])


  // useEffect(() => {
  //   if (approveStatus == 'success') setApproveSuccess(true)
  //   if (approveStatus == 'failed') setApproveFailed(true)
  // }, [approveStatus])

  const approve = async () => {
    approval({ setApprovestatus })
  }

  const addMachine = async () => {
    const cycle = active == 0 ? 360 : active == 1 ? 540 : 1080
    try {
      const web3 = await connectWallet()
      let amount_wei = web3.utils.toWei((amount * 100).toString(), 'mwei')
      // console.log('amount_wei:', amount_wei)
      const tx = await add_machine({ cycle, minerNo, orderId, devId: tmpdevId, poolCode, amount: amount_wei, pledgePower, setTransactionStatus })
    
    } catch (e) {

      setTransactionStatus('fails')
      console.log(e)
    }
  }
  return (
    <div >
      <div className={classes.machineBody}>
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
              onChange={e => setPoolCode(e.target.value)}
              value={poolCode}
            />
          </Grid>

          <Grid item xs={12} style={{ marginBottom: '30px' }}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.inputTitle}
              onChange={e => setDevId(e.target.value)}
            >
              Machine ID
            </Typography>
            <TextField
              placeholder="Input the Mining Machine ID"
              variant="outlined"
              size="medium"
              name="id"
              fullWidth
              type="text"
              value={devId}
            />
          </Grid>
          <Grid item xs={12} sm={6}  >
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
                  {totalPower} T
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
                    availabelPower
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
              placeholder="Please enter the pledge amount"
              variant="outlined"
              name="message"
              fullWidth
              onChange={e => handleAmountChange(e.target.value)}
              value={amount}
            />
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
              approvestatus=='success' ?
                (transactionStatus == 'confirm') && <Button variant="contained" type="submit" size="large"> Waiting Confirm... </Button>
                || (transactionStatus == 'pending') && <Button variant="contained" type="submit" size="large"> Pending... </Button>
                || (transactionStatus == '') && <Button variant="contained" type="submit" color="primary" size="large" onClick={addMachine}>
                      Staking Now
                    </Button>
                || ''
                : (approvestatus=='confirm') &&  <Button variant="contained" type="submit" size="large"> Waiting Confirm... </Button> 
                || (approvestatus=='pending') &&  <Button variant="contained" type="submit" size="large"> pending... </Button> 
                || <Button variant="contained" type="submit" size="large" onClick={approve} >
                    { approvestatus ? 'Has Approved' : 'Approve' }
                  </Button>
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
