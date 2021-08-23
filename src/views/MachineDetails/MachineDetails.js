import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import { useHistory, useLocation } from "react-router-dom";
import { request as req } from '../../req'


const DetailIcon = props => <img src='/assets/detail.png' /> 

const useStyles = makeStyles(theme => ({
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    },
  },
}));

const MachineDetails = ({location}) => {
  const history = useHistory();
  const [times, setTimes] = useState(0)
  
  const classes = useStyles()

  const { state } = location

  console.log('state:', state)

  const { serial_number, pledge_power, m_no, pledge_amount, profit  } = state
  // address: "0xa8E7813150a988e7F20193983fA3017155F3C162"
  // amount: "30"
  // create_time: "2021-08-12 19:52:17"
  // m_no: "M1628750275558C94034F0631E7410"
  // pledge_amount: "30"
  // pledge_power: "1"
  // pool_code: "p12345678"
  // serial_number: "ec24c456-b7cd-6aa9-eb33-e2cc89b32210"
  // update_time: "2021-08-12 21:27:30"

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
    <div>
      <SectionAlternate innerNarrowed> 
        <div className='detail-header'>
          <div className='detail-header-icon'>
            <DetailIcon />
          </div>
          <div className='detail-header-title'>
            Hash power supply { times } times
          </div>
        </div>
        <div className='detail-body'>
          <div className='detail-body-up'>
            <div className='detail-body-up-item'>
              <div className='detail-body-up-item-label'>Current earnings</div>
              <div className='detail-body-up-item-value'>{ profit || '0.0000'}</div>
              <div className='detail-body-up-item-desc'>ADAM</div>
            </div>
            <div className='detail-body-up-item'>
              <div className='detail-body-up-item-label'>Current pledge</div>
              <div className='detail-body-up-item-value'>{ pledge_amount }</div>
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
              <div className='detail-body-down-item-value'>{ m_no }</div>
            </div>
          </div>
        </div>
      </SectionAlternate>
    </div>
  );
};

export default MachineDetails;
