import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import contract_abi from './abi/contract.json'
import adam_abi from './abi/adam.json'

const miner_address = '0xAbE058f40f532749A180d83fCBf12D78E09606F2'
const adam_address = '0x3664cBA2553a48f09B3bf58B6d4A42d18F11Ee07'

export const useWallet = () => {

    const acc = localStorage.getItem('acc')
    const [account, setLocalAccount] = useState(acc || '')

    // const [txStatus, setTxStatus] = useState([])
   

    const connectWallet = () => {
        return new Promise(async (resolve, reject) => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum)
                window.web3 = web3
                try {
                    window.ethereum.enable()

                    window.ethereum.on("accountsChanged", function (accs) {
                        setAccount(accs[0])
                    });
                    resolve(web3)
                } catch (error) {
                    //如果用户拒绝了登录请求
                    if (error === "User rejected provider access") {
                        // 用户拒绝登录后执行语句；
                        console.warn("User rejected provider access");
                    } else {
                        // 本不该执行到这里，但是真到这里了，说明发生了意外
                        console.warn("There was a problem signing you in");
                    }
                    console.log("ethereum 。error")
                    reject(error)
                }
            } else if (window.web3) {
                const web3 = window.web3
                console.log("Injected web3 detected.")
                resolve(web3)
            } else {
                console.log("http://127.0.0.1:9545.")
                // new web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'),
                const provider = new Web3.providers.HttpProvider(
                    "http://127.0.0.1:9545"
                )
                const web3 = new Web3(provider)
                console.log("No web3 instance injected, using Local web3.")
                resolve(web3)
            }
        })
    }

    const shortAccount = () => {
        if (!account) return ''
        let start = account.substr(0, 4)
        let end = account.substr(account.length - 4, 4)
        return start + '..' + end
    }

    const connect = async () => {
        const web3 = await connectWallet()
        window.web3 = web3
       
        const accounts = await web3.eth.getAccounts()
        const currentAccount = accounts[0]
        setAccount(currentAccount)
        return web3
    }

    const setAccount = (acc) => {
        localStorage.setItem('acc', acc)
        setLocalAccount(acc)
    }

    const get_contract = async () => {
        const web3 = await connectWallet()

        console.log(web3)

        const mine_contract = new web3.eth.Contract(contract_abi, miner_address)
        return mine_contract
    }

    const get_pledgeinfo = async () => {
        const my_contract = await get_contract()
        const pledge_info = await my_contract.methods.getPledgeInfo()

        const info = await pledge_info.call({ from: account })
        return {
            total_pledge_adam: info[0],
            total_pledge_power: info[1],
            total_pledge_withdraw: info[2]
        }
    }

    const set_pool_name = async (poolname) => {
        try {
            const my_contract = await get_contract()
            const tx = await my_contract.methods.setPoolName(poolname)
            const res = await tx.send({ from: account })
            return res
        } catch (e) {
            console.log(e)
        }
    }
    const get_pool_name = async () => {
        try {
            const my_contract = await get_contract()
            const tx = await my_contract.methods.getPoolName()
            const poolname = await tx.call({ from: account })
            return poolname
        } catch (e) {
            console.log(e)
        }
    }

    const add_machine = ({ minerNo, orderId, devId, poolCode, amount, pledgePower, cycle, setTransactionStatus }) => {
        return new Promise(async (resolve, reject) => {
            // console.log({ minerNo, orderId, devId, poolCode, amount, pledgePower, cycle })
            try {
                const my_contract = await get_contract()
                const add = my_contract.methods.add(
                    amount,
                    pledgePower,
                    cycle,
                    orderId,// "D1628750275293B9AEFFBA6AB46CD1",
                    poolCode, //"p12345678",
                    devId, // "ec24c456-b7cd-6aa9-eb33-e2cc89b3228c",
                    minerNo // "M1628750275558C94034F0631E74F3"
                )
                console.log('setTransactionStatus:', setTransactionStatus)

                console.log('before signed ......')
                setTransactionStatus('confirm')
                const tx = add.send({ from: account })
                tx.on('transactionHash', function (hash) {
                    console.log('hash::', hash)
                    setTransactionStatus('pending')
                   
                }).on('receipt', function (receipt) {
                    setTransactionStatus('success')

                }).on('error', error => {
                    setTransactionStatus('failed')
                    console.log('tx is failed ......', error)
                })

                // console.log('tx::', tx)
                // tx.on('transactionHash', function (hash) {
                //     // let list = [...txStatus]
                //     // list.push({ txhash: hash, status: 'pending' })
                //     // setTxStatus(list)
                // })

                resolve(tx)
            } catch (e) {
                reject(e)
                console.error(e)
            }
        })
    }

    const approval = async () => {
        const adam_contract = await adam_token()
        const approve = await adam_contract.methods.approve(miner_address, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
        const res = approve.send({ from: account })

        console.log(res)
    }

    const adam_token = async () => {
        const web3 = await connectWallet()
        const token = new web3.eth.Contract(adam_abi, adam_address)
        return token
    }
    const get_allowance = async () => {
        const adam_contract = await adam_token()
        console.log('adam_contract::', adam_contract)
        const approve = await adam_contract.methods.allowance(account, miner_address)
        const allowance = await approve.call({ from: account })
        return allowance
    }

    return {
        account,
        setAccount,
        shortAccount,
        connect,
        connectWallet,
        get_contract,
        get_pledgeinfo,
        set_pool_name,
        get_pool_name,
        add_machine,
        approval,
        get_allowance
    }
}
