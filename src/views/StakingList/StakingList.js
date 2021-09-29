import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, Button } from '@material-ui/core';
import InfiniteScroll from "react-infinite-scroll-component";

import { request as req } from '../../req'
import { useWallet } from '../../useWallet'
import BigNumber from "bignumber.js";

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

const MachineIcon = () => <img src='/assets/machine.png' />
const RefreshIcon = () => <img src='/assets/refresh.png' />
const NoDataIcon = () => <img src='/assets/nodata.png' style={{ width: '50%', maxWidth: '200px' }} />

const pageSize = '10'

const Index = ({ }) => {
    
    const [machinelist, setMachineList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [mycount, setCount] = useState(0)

    const { get_withdraw, send_withdraw, get_userOrderInfo, get_total_powers, get_total_amounts, get_userinfo } = useWallet()

    const classes = useStyles();
    const { account } = useWallet()

    const formatNum = (num, precision = 0, dec = 4) => {
        if (!num) return 0
        let x = new BigNumber(num);
        let x_div = x.dividedBy(10 ** precision)
        let x_fixed = x_div.toFixed(dec);
        return x_fixed
    }

    const machine_No = no => {
        if (no.length > 10) {
            const m_name = no && no.substr(0, 5) + '...' + no.substr(no.length - 5)
            return m_name
        } else {
            return no
        }
    }
  
    const getMoreMachineList = () => {
        setTimeout(async () => {
            if (mycount == machinelist.length && mycount != 0) return;

            var page = currentPage + 1
            if (currentPage == 1) { setLoading(true) }
            var url = '/miner/getOrderList'
            var data = {
                'address': account, //'0x87Cc05a792Aadc4a726C8ada71Ab187d02Ae70a7',
                'currentPage': page.toString(),
                'pageSize': pageSize
            }
            const res = await req.post(url, data)
            const { rows, count } = res
            var list = []

            for (let idx = 0; idx < rows.length; idx++) {
                list[idx] = rows[idx]
                let orderId = list[idx].order_id
                let withdrawable = await get_withdraw({ orderId })
                let orderInfo = await get_userOrderInfo({ orderId })
                
                console.log('orderInfo.drawTime , orderInfo.pledgeTime::', orderInfo.drawTime , orderInfo.pledgeTime)
                
                list[idx].withdrawable = withdrawable
                list[idx].profit = 0 // profit
            }

            console.log('loading..', loading)
            if (currentPage == 1) {
                list = rows
            } else {
                list = rows.concat(machinelist)
            }

            list = machinelist.concat(list)
            console.log('lists:', list)
            setMachineList(list)
            setCurrentPage(page)

            console.log('count:', count, list)
            setCount(count)
            setLoading(false)

        }, 100);
    }
    
    const setwithdrawstatus = (status, msg) => {
        if (status == 'failed') {
            // setErrMsg(msg)
            // setTxStatus(status)
        } else {
            // setErrMsg('')
            // setTxStatus(status)
        }
    }
    
    const withdraw = async (orderId) => {
        // send_withdraw
        let name = await send_withdraw({ orderId,  setwithdrawstatus})
        // setPoolName(name)
        console.log('poolname:', name)
    }

    const testfunc = async() => {
        // let ss =  await get_total_powers()
        // let s2 = await get_total_amounts()
        let s3 = await get_userinfo()
        // console.log('powers: ', ss)
        // console.log('amounts:', s2)
        console.log('userinfo', s3) 

        // get_total_amounts
        // get_userinfo
    }

    useEffect(() => {
        setCurrentPage(0)
        getMoreMachineList()

        testfunc()
    }, [])

    const AdamCard = ({ item }) => {
        
        const {
            m_no,
            amount,
            pledge_power,
            create_time,
            withdrawable,
            order_id
        } = item
        
        console.log('item::', item)

        return (
            <div className='adam-card'  style={{ cursor: 'default' }} >
                <div className='card-header'>
                    <div className='header-icon'>
                        <MachineIcon />
                    </div>
                    <div className='header-title'>
                        {machine_No(m_no)}
                    </div>
                    <Button
                        onClick={() => { 
                            if(withdrawable=='1') {
                                withdraw(order_id)
                            }  else { 
                                console.log('withdrawable 0')
                                withdraw(order_id)
                            }
                        }}
                        variant="contained"
                        color={ withdrawable=='1' ? "primary" : '' }
                        size="small"
                        className={classes.button}
                        style={{
                            marginLeft: 'auto',
                            marginRight: '10px'
                        }}
                    >
                        Withdraw pledge
                    </Button>
                </div>
                <div className='card-body'>
                    <div className='card-body-item'>
                        <div className='card-body-item-label'>Pledge amount</div>
                        <div className='card-body-item-text'>{formatNum(amount, 8)} ADAM </div>
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
            {
                loading === true ? <div className={clsx(classes.loadingCls, 'loading')} ><RefreshIcon /></div> :
                    loading === false && machinelist.length == mycount && mycount == 0 && currentPage == 1 ? <div className={classes.nodataCls}><NoDataIcon /></div>
                        : ''
            }
            <InfiniteScroll
                dataLength={machinelist.length}
                next={getMoreMachineList}
                hasMore={true}
                loader={mycount != machinelist.length ? <h4 style={{ display: 'flex', justifyContent: 'center' }}>Loading...</h4> : ''}
            >
                {machinelist.map((item, key) => <AdamCard item={item} key={key} />)}
            </InfiniteScroll>
        </div>
    );
}

export default Index;
