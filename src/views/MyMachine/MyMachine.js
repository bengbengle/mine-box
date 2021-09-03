import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles, Button, Card, CardContent, Typography, Slide } from '@material-ui/core';
// import useScroll from 'react-use-scroll';
// import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import InfiniteScroll from "react-infinite-scroll-component";


import { useHistory } from "react-router-dom";
import { request as req } from '../../req'
import { useWallet } from '../../useWallet'

import BigNumber from "bignumber.js";

const useStyles = makeStyles(() => ({
  fontWeight900: {
    fontWeight: 900,
  },
  cardBox: {
    minWidth: 275,
    background: '#303030',
    margin: '0.8rem auto',
    maxWidth: '1236px',
    display: 'flex',
    width: '95%'
  },
  cardBox1: {
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
    'flex-direction': 'column'
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
  account: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0.8rem auto',
    alignItems: 'center',
    width: '95%',
    padding: '0px 12px',
    maxWidth: '1236px',
    minWidth: '275px',
  },
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

const Index = ({ themeMode }) => {
  const [machinelist, setMachineList] = useState([]);
  const [pledgeInfo, setPledgeInfo] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)
  const [scroll_h, set_scroll_h] = useState(0)
  const [scrolltop, set_scrolltop] = useState(0)

  const [lists, setlists] = useState([])

  // scroll_h, (scrollTop + viewportSize)

  const classes = useStyles();
  const history = useHistory();
  const { account, get_pledgeinfo } = useWallet()

  const clickAddMachine = props => {
    history.push('/addmachine')
  }

  const formatNum = (num, dec = 4) => {
    let x = new BigNumber(num);
    let x_str = x.toFixed(dec);
    return x_str
  }

  const clickDetailMachine = props => {
    history.push({ pathname: '/machineDetails', state: props })
  }
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

    const profit = res && res.total_profit || '0.0000'
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
      var tmp = []
      tmp = machinelist.concat(rows)
      console.log('lists:', tmp)
      setMachineList(tmp)
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
    }
    let totalPage = count / parseInt(pageSize)
    totalPage = Math.ceil(totalPage)

    setMachineList(list)
    setTotalPage(totalPage)
    setCount(count)
    setLoading(false)
  }

  // 质押信息
  const getPledgeInfo = async () => {

    let info = await get_pledgeinfo()
    const url1 = '/profit/getUserProfit'
    const res1 = await req.post(url1, { address: account })

    const url2 = '/miner/getUserPledge'
    const res2 = await req.post(url2, { address: account })

    const total_pledge = res1 && res2.total_pledge || 0
    const total_adam = res2 && res2.total_adam || 0

    let tmp = [
      {
        title: 'Pledge Power',
        value: formatNum(total_pledge),
        unit_desc: 'PIB'
      }, {
        title: 'Total pledge',
        value: formatNum(total_adam), //res1 && res1.total_lock || 0,
        unit_desc: 'ADAM'
      }
    ]
    setPledgeInfo(tmp)
  }

  const list2 = [{
    title: 'ADAM current price',
    value: formatNum('232.3421'),
    unit_desc: ''
  }, {
    title: 'Estimated rate',
    value: '400%',
    className: 'redfont',
    unit_desc: ''
  }]

  // const handleScroll = event => {

  //   let isToBottom = event.target.scrollTop + event.target.clientHeight - event.target.scrollHeight
  //   console.log('isToBottom::', isToBottom, 'event:', event.target.scrollTop)

  //   // 滚动的高度
  //   // const scrollTop = (event.srcElement ? event.srcElement.documentElement.scrollTop : false) || window.pageYOffset || (event.srcElement ? event.srcElement.body.scrollTop : 0);
  //   // var viewportSize = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  //   // const row_height = 173.5

  //   // const top_h = 330
  //   // const bottom_h = 60
  //   // const rows_h = row_height * parseInt(pageSize) * currentPage
  //   // const scroll_h = top_h + bottom_h + rows_h


  //   // // set_scroll_h(scroll_h)
  //   // // set_scrolltop(scrollTop + viewportSize)


  //   // set_scrolltop(scroll_h);

  //   // if (scrollTop + viewportSize > scroll_h && (machinelist && machinelist.length != count)) {
  //   //   setCurrentPage(currentPage + 1)
  //   // }
  // }

  const fetchMoreData = () => {
    console.log('fetchMoreData')
    setTimeout(() => {
      let new_list = lists.concat(Array.from({length:20 }))
      console.log('new_list', new_list)
      setlists(new_list)
    }, 1500);
  };

  useEffect(() => {
    getPledgeInfo()
    setCurrentPage(1)
    getMachineList()
  }, [])

  // useEffect(() => {
  //   getMachineList()
  // }, [currentPage, account])
  
  const MyCardContent = ({ title, value, unit_desc, class_name }) => {
    return <div style={{ width: '50%' }}>
      <CardContent className={classes.cardContent}>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography className={clsx(classes.value, class_name)} variant="h5" component="h2">
          {value}
        </Typography>
        <Typography className={classes.unit_desc} color="textSecondary" >
          {unit_desc}
        </Typography>
      </CardContent>
    </div>
  }

  const CardList = ({ list }) => (
    <Card className={classes.cardBox} >
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
    console.log('key::', key)
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
            {total_profit || '0.0000'}
          </div>
        </div>
        <div className='card-body'>
          <div className='card-body-item'>
            <div className='card-body-item-label'>Pledge amount</div>
            <div className='card-body-item-text'>{pledge_amount} ADAM </div>
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
      <CardList list={list2}></CardList>

      <div className={classes.account}>
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
        machinelist.length == count && count == 0 && currentPage == 1  ?  <div className={classes.nodataCls}><NoDataIcon /></div>
        : ''
      }
      <InfiniteScroll
          dataLength={machinelist.length}
          next={getMoreMachineList}
          hasMore={true}
          loader={count != machinelist.length ? <h4 style={{display: 'flex', justifyContent: 'center'}}>Loading...</h4> :  ''}
        >
          {machinelist.map((item, index) => (
            <AdamCard key={index} item={item} />
          ))} 
        </InfiniteScroll>
    </div>
  );
}

export default Index;
