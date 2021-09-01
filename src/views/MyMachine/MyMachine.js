import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles, Button, Card, CardContent, Typography, Slide } from '@material-ui/core';
import useScroll from 'react-use-scroll';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

import { useHistory } from "react-router-dom";
import { request as req } from '../../req'
import { useWallet } from '../../useWallet'

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
    'justify-content': 'center',
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
    'align-items': 'center',
    width: '95%',
    padding: '0px 12px',
    'max-width': '1236px',
    'min-width': '275px'
  },
  accountIcon: {
    marginRight: '7px',
  },
  accountWallet: {
    'margin-left': 'auto'
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
  }
}));

const AddIcon = props => <img src='/assets/add.png' style={{ width: '1rem', height: '1rem' }} />
const MachineIcon = props => <img src='/assets/machine.png' />
const RefreshIcon = props => <img src='/assets/refresh.png' />
const NoDataIcon = props => <img src='/assets/nodata.png' style={{width: '50%', maxWidth: '200px'}} />
const pageSize = '30'

const Index = ({ themeMode }) => {
  const [machinelist, setMachineList] = useState();
  const [pledgeInfo, setPledgeInfo] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const classes = useStyles();
  const history = useHistory();
  const { account, get_pledgeinfo } = useWallet()

  const clickAddMachine = props => {
    history.push('/addmachine')
  }

  const clickDetailMachine = props => { 
    history.push({pathname: '/machineDetails',  state: props })
  }
  const machine_No = no => {
    const m_name = no && no.substr(0, 5) + '...' + no.substr(no.length - 5)

    return m_name
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
  const getMachineList = async () => {
    let url = '/miner/getMinerPledgeByAddress'
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
      tmp = [...machinelist, ...rows]
    }  
    tmp = tmp.map(m => {
      m.pledge_amount = m.amount
      return m
    })
    var list = []
    for(let idx = 0; idx < tmp.length; idx++ ) {
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
    setLoading(false)
  }

  // 质押信息
  const getPledgeInfo = async () => {
    
    let info = await get_pledgeinfo()
    console.log('info:', info)

    let tmp = [
      {
        title: 'Pledge Power',
        value: info.total_pledge_power,
        unit_desc: 'PIB'
      }, {
        title: 'Total pledge',
        value: info.total_pledge_adam,
        unit_desc: 'ADAM'
      }
    ]
    setPledgeInfo(tmp)
  }

  const list2 = [{
    title: 'ADAM current price',
    value: '232.3421',
    unit_desc: ''
  }, {
    title: 'Estimated rate',
    value: '400%',
    className: 'redfont',
    unit_desc: ''
  }]

  const handleScroll = event => {
    let client_height = document.documentElement.clientHeight; //视口的高度
    let scroll_height = document.documentElement.scrollHeight; //文档的高度
    let scroll_top = document.documentElement.scrollTop || document.body.scrollTop;

    // console.log('client_height:', client_height, 'scroll_height:', scroll_height, 'scroll_top:', scroll_top)
    
    // 滚动的高度
    const scrollTop = (event.srcElement ? event.srcElement.documentElement.scrollTop : false) || window.pageYOffset || (event.srcElement ? event.srcElement.body.scrollTop : 0);
    var viewportSize = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    const row_height = 173.5
    const offset_height = 275
    
    const top_h = 330
    const bottom_h = 60
    const rows_h = row_height * parseInt(pageSize) * currentPage
    const scroll_h = top_h + bottom_h + rows_h - viewportSize
 
    if(scrollTop > scroll_h) {
      setCurrentPage(currentPage + 1)
    }

    console.log('viewportSize::', viewportSize)
    console.log('scrollTop::', scrollTop)
    console.log('currentPage::', currentPage, 'rows_h:', row_height * parseInt(pageSize))
  }

 

  useEffect(() => {
    console.log('init .....')
    getPledgeInfo()
    window.addEventListener('scroll', handleScroll)
    return () => { // useEffect卸载时解绑
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    
    getMachineList()
    
  }, [currentPage])

  useEffect(()=> {
    
    setCurrentPage(1)
    getMachineList()

    
  }, [account])

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

  const AdamCard = ({ item }) => {
    const {
      total_profit,
      m_no,
      pledge_amount,
      pledge_power,
      create_time
    } = item
    return (
      <div className='adam-card' data-aos='fade-up' data-aos-once='true' onClick={() => clickDetailMachine(item)} >
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
        // machinelist.map((item, idx) => {
        //   return <AdamCard key={idx} item={item} />
        // }) 
      }
      
      {
        loading == true ? <div className='loading' style={{
          width: '100%',
          marginTop: '100px',
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center'
        }}><RefreshIcon /> </div> 
        : machinelist&&machinelist.length == 0 && currentPage == 1 ? <div style={{
          width: '100%',
          marginTop: '100px',
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center'
        }}><NoDataIcon  /></div> 
        : machinelist&&machinelist.map((item, idx) => {
          return <AdamCard key={idx} item={item} />
        })
      }
    </div>
  );
}

export default Index;
