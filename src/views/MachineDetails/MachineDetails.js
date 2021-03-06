import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import { useHistory, useLocation } from "react-router-dom";
import { request as req } from '../../req'
import BigNumber from "bignumber.js";

const DetailIcon = props => <img src='/assets/detail.png' />

const useStyles = makeStyles(theme => ({
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    }
  }
}));


const formatNum = (num, precision = 0, dec = 4) => {
  if (!num) return 0
  let x = new BigNumber(num);
  let x_div = x.dividedBy(10 ** precision)
  let x_fixed = x_div.toFixed(dec);
  return x_fixed
}


const MachineDetails = ({ location }) => {
  const history = useHistory();
  const [times, setTimes] = useState(0)

  // const classes = useStyles()

  const { state } = location

  console.log('state:', state)

  const { serial_number, pledge_power, m_no, amount, profit } = state

  const getMinerTimes = async () => {
    {
      // 总算力
      const url = '/miner/getMinerInfo'
      const data = {
        serialNumber: serial_number
      }
      const res = await req.post(url, data)
      const times = res && res.count || 0
      // console.log('times:', times)
      setTimes(times)
    }
  }

  useEffect(() => {
    getMinerTimes()
  }, [])
  return (
    <div data-aos='fade-up'>
      <SectionAlternate innerNarrowed>
        <div className='detail-header'>
          <div className='detail-header-icon'>
            <DetailIcon />
          </div>
          <div className='detail-header-title'>
            Hash power supply {times} times
          </div>
        </div>
        <div className='detail-body'>
          <div className='detail-body-up'>
            <div className='detail-body-up-item'>
              <div className='detail-body-up-item-label'>Current earnings</div>
              <div className='detail-body-up-item-value'>{formatNum(profit, 0) || '0.0000'}</div>
              <div className='detail-body-up-item-desc'>ADAM</div>
            </div>
            <div className='detail-body-up-item'>
              <div className='detail-body-up-item-label'>Current pledge</div>
              <div className='detail-body-up-item-value'>{formatNum(amount, 8)}</div>
              <div className='detail-body-up-item-desc'>ADAM</div>
            </div>
          </div>
          <div className='detail-body-down'>
            <div className='detail-body-down-item'>
              <div className='detail-body-down-item-label'>Pledge computing power</div>
              <div className='detail-body-down-item-value'>{pledge_power} T</div>
            </div>
            <div className='detail-body-down-item'>
              <div className='detail-body-down-item-label'>Miner ID</div>
              <div className='detail-body-down-item-value'>{m_no}</div>
            </div>
          </div>
        </div>
      </SectionAlternate>
    </div>
  );
};

export default MachineDetails;
