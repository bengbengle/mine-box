import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom"
import { makeStyles, Button, Card, CardContent, Typography } from '@material-ui/core';
import {
  Chart,
  PieSeries,
  Title,
  Tooltip,
  Legend
} from "@devexpress/dx-react-chart-material-ui";
import {
  Palette,
  EventTracker,
} from "@devexpress/dx-react-chart";
import BigNumber from "bignumber.js";

import { withStyles } from '@material-ui/core/styles'
import { request as req } from '../../req'
import { useWallet } from '../../useWallet'

const useStyles = makeStyles(() => ({
  fontWeight900: {
    fontWeight: 900,
  },
  cardBox: {
    minWidth: 275,
    background: '#303030',
    marginTop: '5%',
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
  bottomBox: {
    minWidth: 275,
    background: '#303030',
    margin: '0.8rem auto',
    maxWidth: '1236px',
    display: 'flex',
    width: '95%',
    marginBottom: '50px'
  }
}));


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



const Index = ({ themeMode }) => {
  const [tips, setTips] = useState(null);

  const [totalProfit, setTotalProfit] = useState(0); // 总收益
  const [totalRelease, setTotalRelease] = useState(0); // 总释放
  const [totalLock, setTotalLock] = useState(0); // 总释放
  const [minertimes, setMinerTimes] = useState(0); // 总质押次数
  const [chartdata, setChartData] = useState([
    { category: "Whole network profit", val: 99 },
    { category: "Current profit", val: 1 }
  ])

  const history = useHistory()

  const classes = useStyles();

  const { account, get_pledgeinfo } = useWallet()

  const formatNum = (num, dec = 4) => {
    let x = new BigNumber(num);
    let x_str = x.toFixed(dec);
    return x_str
  }

  const getMyEarnInfo = async (address) => {

    const url = '/profit/getUserProfit'
    const res = await req.post(url, { address: address })

    setTotalRelease(res && res.total_release || 0)
    setTotalProfit(res && res.total_profit || 0)
    setTotalLock(res && res.total_lock || 0)
    setMinerTimes(res && res.miner_count || 0)


    let all_profit = res && res.all_profit || 0
    let my_profit = res && res.total_profit || 0

    setChartData([
      { category: "Whole network profit", val: all_profit },
      { category: "Current profit", val: my_profit }
    ])
  }

  // const chart_data = [
  //   { category: "Whole network profit", val: 5 },
  //   { category: "Current profit", val: 20 }
  // ]

  const chart_scheme = ["#EF0A0A", "#FF6B22"];

  const clickTooltip = (props) => {
    console.log(props)
  }

  const list = [{
    title: 'Total revenue',
    value: formatNum(totalProfit),
    unit_desc: 'ADAM'
  }, {
    title: 'Total Release',
    value: formatNum(totalRelease),
    unit_desc: 'ADAM'
  }]
  const list2 = [{
    title: '',
    value: formatNum(totalLock),
    unit_desc: 'Locked(ADAM)'
  }, {
    title: '',
    value: minertimes,
    unit_desc: 'Number of miners'
  }]

  const MyCardContent = ({ title, value, unit_desc }) => {
    return <div style={{ width: '50%' }}>
      <CardContent className={classes.cardContent}>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography className={classes.value} variant="h5" component="h2">
          {value}
        </Typography>
        <Typography className={classes.unit_desc} color="textSecondary" >
          {unit_desc}
        </Typography>
      </CardContent>
    </div>
  }
  const CardList = ({ list }) => (

    <Card className={classes.cardBox} data-aos='fade-up'>
      {
        list.map(({ title, value, unit_desc }, key) => (
          <MyCardContent
            key={key}
            title={title}
            value={value}
            unit_desc={unit_desc}>
          </MyCardContent>
        ))
      }
    </Card>
  )


  const clickWithdrawButton = props => {
    history.push('/withdraw')
  }

  useEffect(() => {
    getMyEarnInfo(account)
  }, [])

  return (
    <div>
      <CardList list={list}></CardList>
      <CardList list={list2}></CardList>

      <Card className={classes.cardBox} data-aos='fade-up'>
        <Chart data={chartdata} style={{
          width: '90%',
          marginLeft: '5%',
          lineHeight: '45px',
          padding: '0px',
          margin: '10px auto',
          marginTop: '5%',
        }}>
          <Title text="329.8347（ADAM）" className={classes.chartTitle} />
          <Palette scheme={chart_scheme} />
          <PieSeries innerRadius={0.5} outerRadius={0.7} valueField="val" argumentField="category" />
          <EventTracker onClick={clickTooltip} />
          <Legend position="bottom" rootComponent={Root} itemComponent={Item} labelComponent={Label} />
        </Chart>
      </Card>
      <Card className={classes.bottomBox} data-aos='fade-up'>
        <Button
          onClick={clickWithdrawButton}
          fullWidth
          variant="contained"
          type="submit"
          color="primary"
          size="large"
        >
          Withdraw Profit
        </Button>
      </Card>
    </div>
  );
}

export default Index;