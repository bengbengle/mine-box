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

import { useWallet } from '../../useWallet'
import { request as req } from '../../req'


import { withStyles } from '@material-ui/core/styles'

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
    marginTop: '5%',
    marginLeft: '5%',
    lineHeight: '45px'
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
}))

const HelpIcon = props => <img src='/assets/help.png' style={{ width: '1.2rem', height: '1.2rem' }} />

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


const CardItem = ({ classes, title, value, unit_desc, has_help }) => {


  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };
  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return <div style={{ width: '50%' }}>
    <CardContent className={classes.cardContent}>
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        {title}
        {has_help &&
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
              title={title}
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              placement="bottom">
              <IconButton onClick={handleTooltipOpen}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </ClickAwayListener>
        }
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

const CardList = ({ classes, list }) => (
  <Card className={classes.cardBox} data-aos='fade-up'>
    {
      list.map(({ title, value, unit_desc, has_help }, key) => (
        <CardItem
          key={key}
          title={title}
          value={value}
          classes={classes}
          has_help={has_help}
          unit_desc={unit_desc}>
        </CardItem>
      ))
    }
  </Card>
)

const Index = () => {

  const classes = useStyles()
  const history = useHistory()
  const { account, get_pledgeinfo } = useWallet()

  const [total_pledge_adam, set_total_pledge_adam] = useState(0); // 总质押adam
  const [total_pledge_power, set_total_pledge_power] = useState(0); // 总质押算力
  const [total_pledge_withdraw, set_total_pledge_withdraw] = useState(0); // 总质押算力
 

  const getMyStakingInfo = async (address) => {
    const url = '/miner/getUserProfit'
    const res = await req.post(url, { address: address })
    console.log(res)

    let info = await get_pledgeinfo()

    console.log('info:::', info)
    set_total_pledge_adam(info && info.total_pledge_adam || 0)
    set_total_pledge_power(info && info.total_pledge_power || 0)
    set_total_pledge_withdraw(info && info.total_pledge_withdraw || 0)

  }

  const clickWithdrawButton = props => {
    history.push('/unstaking')
  }

  const chart_data = [
    { category: "Total Pledge", val: 5 },
    { category: "My Pledge", val: 20 }
  ]

  const colors = ["#EF0A0A", "#FF6B22"]
  
  useEffect(() => {
    getMyStakingInfo(account)
  }, [])

  return (
    <div>
      <Card className={classes.cardBox} data-aos='fade-up'>
        <CardItem
          key={0}
          title={'Pledge Power'}
          value={total_pledge_power}
          classes={classes}
          has_help={true}
          unit_desc={'PIB'}>
        </CardItem>
        <CardItem
          key={1}
          title={'Total pledge'}
          value={total_pledge_adam}
          classes={classes}
          has_help={true}
          unit_desc={'ADAM'}>
        </CardItem>
      </Card>
      <Card className={classes.cardBox} data-aos='fade-up'>
        <CardItem
          key={0}
          title={'Expired'}
          value={'0'}
          classes={classes}
          has_help={true}
          unit_desc={'PIB'}>
        </CardItem>
        <CardItem
          key={1}
          title={'Extracted'}
          value={total_pledge_withdraw}
          classes={classes}
          has_help={true}
          unit_desc={'ADAM'}>
        </CardItem>
      </Card>
     

      <Card className={classes.cardBox} style={{
        margin: '0px auto!important'
      }} data-aos='fade-up'>
        <Chart data={chart_data} className={classes.mychart}>
          <Title text="30.2 P" />
          <Palette scheme={colors} />
          <PieSeries innerRadius={0.7} outerRadius={1} valueField="val" argumentField="category" />
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
          Withdraw pledge
        </Button>
      </Card>
    </div>
  )
}

export default Index