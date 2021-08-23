import React, { useState } from 'react';
import { makeStyles, useTheme, useMediaQuery, Card, CardActions, CardContent, Typography, Paper } from '@material-ui/core';
import {
  Chart, PieSeries, Title,
  Tooltip
} from "@devexpress/dx-react-chart-material-ui";
import {
  Palette,
  EventTracker,
} from "@devexpress/dx-react-chart";

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
  }
}));

const Index = ({  }) => {
  const [tips, setTips] = useState(null);

  const classes = useStyles();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const changeTooltip = targetItem => {
    const index = targetItem && targetItem.point || 0
    console.log(targetItem, index, chart_data[index])

    setTips(targetItem)
  }

  const chart_data = [
    { category: "item1", val: 5 },
    { category: "item2", val: 20 }
  ];

  const chart_scheme = ["#EF0A0A", "#FF6B22"];

  const tooltipContentTitleStyle = {
    fontWeight: 'bold',
    paddingBottom: 0,
  };
  const tooltipContentBodyStyle = {
    paddingTop: 0,
  };

  const clickTooltip = (props) => {
    console.log(props)
  }

  const TooltipContent = (props) => {
    const { targetItem, text, ...restProps } = props;
    console.log(props)
    return (
      <div>
        <div>
          <Tooltip.Content
            {...restProps}
            style={tooltipContentTitleStyle}
          />
        </div>
        <div>
          <Tooltip.Content
            {...restProps}
            style={tooltipContentBodyStyle}
          />
        </div>
      </div>
    );
  };

  const list = [{
    title: 'Pledge Power',
    value: '232.3421',
    unit_desc: 'PIB'
  }, {
    title: 'Total pledge',
    value: '2000W',
    unit_desc: 'ADAM'
  }]
  const list2 = [{
    title: 'Expired',
    value: '232.3421',
    unit_desc: 'PIB'
  }, {
    title: 'Extracted',
    value: '2000W',
    unit_desc: 'ADAM'
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

  const CardList = ({list}) => (

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
  return (
    <div>
      <CardList list={list}></CardList>
      <CardList list={list2}></CardList>
      <Card className={classes.cardBox} data-aos='fade-up'>
        
        <Chart data={chart_data} style={{
          width: '96%',
          marginTop: '5%',
          marginLeft: '5%',
          lineHeight: '45px'
        }}>
          <Title text="329998.8347（ADAM）" className={classes.chartTitle} />
          <Palette scheme={chart_scheme} />
          <PieSeries innerRadius={0.55} outerRadius={0.9} valueField="val" argumentField="category" />
          <EventTracker onClick={clickTooltip} />
          <Tooltip
            targetItem={tips}
            onTargetItemChange={changeTooltip}
            contentComponent={TooltipContent}
          />
        </Chart>
      </Card>
    </div>
  );
}

export default Index;
