import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles, Button, Card, CardContent, Typography, Slide } from '@material-ui/core';
import InfiniteScroll from "react-infinite-scroll-component";
import CountUp from "react-countup";

import { useHistory } from "react-router-dom";
import { request as req } from '../../req'
import { useWallet } from '../../useWallet'
import BigNumber from "bignumber.js";
import axios from 'axios'

const useStyles = makeStyles(() => ({
  fontWeight900: {
    fontWeight: 900,
  },
  cardBox: {
    minWidth: 275,
    margin: '0.8rem auto',
    maxWidth: '1236px',
    display: 'flex',
    width: '95%'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: '0.8rem'
  },
  value: {
    marginTop: 10,
  },
  unit_desc: {
    marginTop: 10,
    fontSize: '0.8rem'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  chartTitle: {
    background: '#444444',
    borderRadius: '15px',
    height: '45px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  // account: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   margin: '0.8rem auto',
  //   alignItems: 'center',
  //   width: '95%',
  //   padding: '0px 12px',
  //   maxWidth: '1236px',
  //   minWidth: '275px',
  // },
  accountIcon: {
    marginRight: '7px',
  },
  accountWallet: {
    marginLeft: 'auto'
  },
  accountAddress: {
    display: 'flex',
    alignItems: 'center',
    'border-radius': '25px',
    color: '#999999',
    background: '#303030',
    padding: '0px 18px 0px 0px'
  },
  groupTitle: {
    'font-weight': 'bold',
    'color': '#FFFFFF'
  },
  mineAddIcon: {
    'margin-left': 'auto'
  },
  loadingCls: {
    width: '100%',
    marginTop: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  nodataCls: {
    width: '100%',
    marginTop: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const AddIcon = props => <img src='/assets/add.png' style={{ width: '1rem', height: '1rem' }} />
const MachineIcon = props => <img src='/assets/machine.png' />
const RefreshIcon = props => <img src='/assets/refresh.png' />
const NoDataIcon = props => <img src='/assets/nodata.png' style={{ width: '50%', maxWidth: '200px' }} />

const pageSize = '5'
const selltoken = '0xdde077002982956DF24E23E3f3743BA5e56929fe'  // adam
const buytoken = '0x55d398326f99059ff775485246999027b3197955'   // usdt
const dodoBaseUrl = 'https://bsc.api.0x.org/swap/v1/price'

const Index = ({ themeMode }) => {
  const [machinelist, setMachineList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(null)
  const [count, setCount] = useState(0)

  const [pledgeInfo, setPledgeInfo] = useState(
    [
      {
        title: 'Pledge Power',
        value: '...',
        unit_desc: 'T'
      }, {
        title: 'Total pledge',
        value: '...', //res1 && res1.total_lock || 0,
        unit_desc: 'ADAM'
      }
    ]
  )

  const [priceInfo, setPriceInfo] = useState(
    [{
      title: 'ADAM current price',
      value: '0.0000',
      unit_desc: ''
    }, {
      title: 'Estimated rate',
      value: '400%',
      className: 'redfont',
      unit_desc: ''
    }]
  );

  const classes = useStyles();
  const history = useHistory();
  const { account } = useWallet()

  const clickAddMachine = () => history.push('/addmachine')

  const formatNum = (num, precision = 0, dec = 4) => {
    if(!num) return 0
    let x = new BigNumber(num);
    let x_div = x.dividedBy(10 ** precision)
    let x_fixed = x_div.toFixed(dec);
    return x_fixed
  }

  const clickDetailMachine = props => history.push({ pathname: '/machineDetails', state: props })

  const machine_No = no => {
    if (no.length > 10) {
      const m_name = no && no.substr(0, 5) + '...' + no.substr(no.length - 5)
      return m_name
    } else {
      return no
    }
  }

  const getProfit = async id => {
    let url = '/miner/getMinerProfit'
    let data = {
      'serialNumber': id
    }
    const res = await req.post(url, data)

    console.log('res::', res)
    const profit = res || '0.0000'
    return profit
  }

  const getMoreMachineList = () => {
    setTimeout(async () => {
      var page = currentPage + 1
      var url = '/miner/getMinerList'
      var data = {
        'address': account,
        'currentPage': page.toString(),
        'pageSize': pageSize
      }
      const res = await req.post(url, data)
      const { rows, count } = res
      // var list = []
      var list = []
      for (let idx = 0; idx < rows.length; idx++) {
        list[idx] = rows[idx]
        list[idx].amount = rows[idx].amount
        let id = list[idx].serial_number
        let profit = await getProfit(id)
        list[idx].profit = profit
        list[idx].total_profit = profit
      }
      
      list = machinelist.concat(rows)
      console.log('lists:', list)
      setMachineList(list)
      setCurrentPage(page)
    }, 100);
  }

  const getMachineList = async () => {
    let url = '/miner/getMinerList'
    let data = {
      'address': account,
      'currentPage': currentPage.toString(),
      'pageSize': pageSize
    }
    const res = await req.post(url, data)
    const { rows, count } = res
    let tmp = []
    if (currentPage == 1) {
      setLoading(true)
      tmp = rows
    } else {
      tmp = rows.concat(machinelist)
    }
    tmp = tmp.map(m => {
      m.pledge_amount = m.amount
      return m
    })
    var list = []
    for (let idx = 0; idx < tmp.length; idx++) {
      list[idx] = tmp[idx]
      list[idx].amount = tmp[idx].amount
      let id = list[idx].serial_number
      let profit = await getProfit(id)
      list[idx].profit = profit
      list[idx].total_profit = profit
    }
    console.log('list:', list)
    
    setMachineList(list)
    setCount(count)
    setLoading(false)
  }

  // 质押信息
  const getPledgeInfo = async () => {
 
    const url1 = '/profit/getUserProfit'
    const res1 = await req.post(url1, { address: account })

    const url2 = '/miner/getUserPledge'
    const res2 = await req.post(url2, { address: account })
     
    
    const all_profit = res1 && res1.all_profit || 0
    const all_pledge = res2 && res2.all_pledge || 0

    let tmp = [
      {
        title: 'Total network power',
        value: formatNum(all_pledge),
        unit_desc: 'T'
      }, {
        title: 'Total network profit',
        value: formatNum(all_profit),
        unit_desc: 'ADAM'
      }
    ]
    setPledgeInfo(tmp)


    
    let url_price = `${dodoBaseUrl}?sellToken=${selltoken}&buyToken=${buytoken}&sellAmount=10000000`

    let res_price = await axios.get(url_price)
    let price = res_price.data.price
    
    let price_info = [{
      title: 'ADAM current price',
      value: formatNum(price),
      unit_desc: ''
    }, {
      title: 'Estimated rate',
      value: '400%',
      className: 'redfont',
      unit_desc: ''
    }]

    setPriceInfo(price_info)
  }

  useEffect(() => {
    getPledgeInfo()
    setCurrentPage(1)
    getMachineList()
  }, [])
 
  const MyCardContent = ({ title, value, unit_desc, class_name }) => {
    return <div style={{ width: '50%' }}>
      <CardContent className={classes.cardContent}>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography className={clsx(classes.value, class_name)} variant="h5" component="h2">
          {
            title == 'Estimated rate' ? value : 
            <CountUp start={0} end={value} duration="1" decimal='.' decimals={4} separator=',' useGrouping="true" />
          }
        </Typography>
        <Typography className={classes.unit_desc} color="textSecondary" >
          {unit_desc}
        </Typography>
      </CardContent>
    </div>
  }

  const CardList = ({ list }) => (
    <Card className='cardBox' >
      {
        list && list.map(({ title, value, unit_desc, className }, key) => (
          <MyCardContent
            key={key}
            title={title}
            value={value}
            class_name={className && className}
            unit_desc={unit_desc}>
          </MyCardContent>
        ))
      }
    </Card>
  )

  const AdamCard = ({ item, key }) => {
    console.log('item..', item)
    const {
      total_profit,
      m_no,
      pledge_amount,
      pledge_power,
      create_time
    } = item
    return (
      <div className='adam-card' onClick={() => clickDetailMachine(item)} >
        <div className='card-header'>
          <div className='header-icon'>
            <MachineIcon />
          </div>
          <div className='header-title'>
            {machine_No(m_no)}
          </div>
          <div className='header-profit'>
            {formatNum(total_profit) || '0.0000'}
          </div>
        </div>
        <div className='card-body'>
          <div className='card-body-item'>
            <div className='card-body-item-label'>Pledge amount</div>
            <div className='card-body-item-text'>{ formatNum(pledge_amount, 8) } ADAM </div>
          </div>
          <div className='card-body-item'>
            <div className='card-body-item-label'>Pledge computing power</div>
            <div className='card-body-item-text'>{pledge_power} T </div>
          </div>
          <div className='card-body-item'>
            <div className='card-body-item-label'>Pledge time</div>
            <div className='card-body-item-text'>{create_time}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>

      <CardList list={pledgeInfo}></CardList>

      <CardList list={priceInfo}></CardList>

      <div className='account-content'>
        <div className={classes.groupTitle}>
          Mining machine
        </div>
        <div className={classes.accountWallet}>
          <Button
            onClick={clickAddMachine}
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<AddIcon />}
          >
            Add Machine
          </Button>
        </div>
      </div>
      {
        loading === true ? <div className={clsx(classes.loadingCls, 'loading')} ><RefreshIcon /></div> :
        loading === false && machinelist.length == count && count == 0 && currentPage == 1 ? <div className={classes.nodataCls}><NoDataIcon /></div>
            : ''
      }
      <InfiniteScroll
        dataLength={machinelist.length}
        next={getMoreMachineList}
        hasMore={true}
        loader={count != machinelist.length ? <h4 style={{ display: 'flex', justifyContent: 'center' }}>Loading...</h4> : ''}
      >
        {machinelist.map((item, key) => (
          <AdamCard item={item} key={key} />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default Index;
