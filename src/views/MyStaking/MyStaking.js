import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { makeStyles, ClickAwayListener, useMediaQuery, Card, CardContent, Typography, IconButton, Button, Tooltip } from '@material-ui/core'
import {
  Chart,
  PieSeries,
  Title,
  Legend
} from "@devexpress/dx-react-chart-material-ui"
import {
  Palette,
} from "@devexpress/dx-react-chart"
import BigNumber from "bignumber.js";
import CountUp from "react-countup";

import { useWallet } from '../../useWallet'
import { request as req } from '../../req'

import { withStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  fontWeight900: {
    fontWeight: 900,
  }, 
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: '0.8rem',
    marginBottom: '0px'
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
  mychart: {
    width: '96%',
    marginLeft: '5%',
    lineHeight: '45px'
  },
}))
 
const legendStyles = () => ({
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
  },
})

const legendLabelStyles = theme => ({
  label: {
    whiteSpace: 'nowrap',
  },
})

const legendItemStyles = () => ({
  item: {
    flexDirection: 'row',
  },
})

const legendRootBase = ({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
)
const legendLabelBase = ({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
)
const legendItemBase = ({ classes, ...restProps }) => (
  <Legend.Item className={classes.item} {...restProps} />
)

const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase)
const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase)
const Item = withStyles(legendItemStyles, { name: 'LegendItem' })(legendItemBase)


const CardItem = ({ classes, title, value, unit_desc, is_number }) => {
 
  return <div style={{ width: '50%' }}>
    <CardContent className={classes.cardContent}>
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography className={classes.value} variant="h5" component="h2">
        {!is_number ? value :  <CountUp start={0} end={value} duration="1" decimal='.' decimals={4} separator=',' useGrouping="true" />}
      </Typography>
      <Typography className={classes.unit_desc} color="textSecondary" >
        {unit_desc}
      </Typography>
    </CardContent>
  </div>
}


const Index = () => {
  const classes = useStyles()
  const history = useHistory()
  const { account, get_pledgeinfo, get_userinfo } = useWallet()

  const [total_pledge_adam, set_total_pledge_adam] = useState(0); // 总质押 adam
  const [total_pledge_power, set_total_pledge_power] = useState(0); // 总质押 算力
 
  const [expired_machine_number, set_expired_machine_number] = useState(0); // 已到期 算力
  const [extracted_adam, set_extracted_adam] = useState(0); // 已提取 算力

  const [chart_data, set_chart_data] = useState([
      { category: "Total Pledge", val: 99 },
      { category: "My Pledge", val: 1 }
  ])

  const getMyStakingInfo = async (address) => {
    const url = '/miner/getUserPledge'
    const res = await req.post(url, { address: address })
    console.log(res)
  
    set_total_pledge_adam(res && res.total_adam || 0) // 总质押 adam
    set_total_pledge_power(res && res.total_pledge || 0) // 总质押 power

    // set_expired_machine_number(res && res.total_date || 0) // 已到期
    set_extracted_adam(res && res.total_draw || 0) // 已提取

    let all_pledge = res && res.all_pledge || 1
    let total_pledge = res && res.total_pledge || 0
     
    set_chart_data([
        { category: "Total Pledge", val: (parseFloat(all_pledge)  - parseFloat(total_pledge)) },
        { category: "My Pledge", val: total_pledge }
    ])
  }

  const formatNum = (num, precision = 0, dec = 4) => {
    let x = new BigNumber(num);
    let x_div = x.dividedBy(10 ** precision)
    let x_fixed = x_div.toFixed(dec);
    return x_fixed
  }

  const clickWithdrawButton = props => {
    // history.push('/unstaking')
    history.push('/stakinglist')
  }
 
  const getExpiredMachineLength = async () => {
    var url = '/miner/getOrderList'
    var data = {
        'address': account,
        'currentPage': '1',
        'pageSize': '0'
    }
    const res = await req.post(url, data)
    const { count } = res
    set_expired_machine_number(count || 0) // 已到期

    let userinfo = await get_userinfo()
    console.log('userinfo', userinfo) 
    let { drawAdam, drawPower, amount } = userinfo
    
    // amount: "3000000000"    // 质押adam 
    // cycle: "360"
    // devId: "vir-0000"
    // drawAdam: "0"       / 已提取 adam 
    // drawPower: "0"      / 已提取算力 
    console.log('length::', count)
  
  }

  const colors = ["#EF0A0A", "#FF6B22"]
  
  useEffect(() => {
    getMyStakingInfo(account)

    getExpiredMachineLength()
  
  }, [])

  return (
    <div data-aos='fade-up'>
      <Card className='cardBox' >
        <CardItem
          key={0}
          title={'Pledge power'}
          value={total_pledge_power }
          classes={classes}
          is_number={true}
          unit_desc={'T'}>
        </CardItem>
        <CardItem
          key={1}
          title={'Total pledge'}
          value={formatNum(total_pledge_adam, 8)}
          classes={classes}
          is_number={true}
          unit_desc={'ADAM'}>
        </CardItem>
      </Card>
      <Card className='cardBox' >
        <CardItem
          key={0}
          title={''}
          value={expired_machine_number}
          classes={classes}
          is_number={false}
          unit_desc={'Expired machines number'}>
        </CardItem>
        <CardItem
          key={1}
          title={''}
          value={formatNum(extracted_adam, 8)}
          classes={classes}
          is_number={true}
          unit_desc={'Extracted(ADAM)'}>
        </CardItem>
      </Card>

      <Card className='cardBox' style={{
        margin: '0px auto!important'
      }} >
        <Chart data={chart_data} className={classes.mychart}>
          <Title text={
             <CountUp start={0} end={total_pledge_power } suffix=" T"  duration="1" decimal='.' decimals={4} separator=',' useGrouping="true" />
          }/>
          <Palette scheme={colors} />
          <PieSeries innerRadius={0.5} outerRadius={0.7} valueField="val" argumentField="category" />
          <Legend position="bottom" rootComponent={Root} itemComponent={Item} labelComponent={Label} />
        </Chart>
      </Card>

      <Card className={'bottomBox'} >
        <Button
          onClick={clickWithdrawButton}
          fullWidth
          variant="contained"
          type="submit"
          color="primary"
          size="large"
        >
          Withdraw pledge
        </Button>
      </Card>
    </div>
  )
}

export default Index