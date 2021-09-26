import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import contract_abi_v1 from './abi/contract.json'
import contract_abi_v2 from './abi/contractV2.json'
import adam_abi from './abi/adam.json'

const version = process.env.REACT_APP_VERSION

const miner_address = version == 1 ? process.env.REACT_APP_MINER_ADDR_V1 : process.env.REACT_APP_MINER_ADDR_V2
const contract_abi = version == 1 ? contract_abi_v1 : contract_abi_v2
const adam_address = process.env.REACT_APP_ADAM_ADDR

export const useWallet = () => {

    const acc = localStorage.getItem('acc')
    const [account, setLocalAccount] = useState(acc || '')

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
        const mine_contract = new web3.eth.Contract(contract_abi, miner_address)
        return mine_contract
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

    const availPledage = async ({ power }) => {
        try {
            const my_contract = await get_contract()
            const tx = await my_contract.methods.availPledage(power)
            const availble = await tx.call({ from: account })
            return availble
        } catch (e) {
            console.log(e)
        }
    }

    const add_machine = ({ minerNo, orderId, devId, poolCode, amount, pledgePower, cycle, setTransactionStatus }) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log({ minerNo, orderId, devId, poolCode, amount, pledgePower, cycle })
                const my_contract = await get_contract()

                const verif = await my_contract.methods.veriftyeposit(
                    amount,
                    pledgePower,
                    cycle,
                    orderId,
                    poolCode, 
                    devId, 
                    minerNo 
                )
                const verify_code = await verif.call({ from: account })

                switch (verify_code) {
                    case '0': 
                        const add = my_contract.methods.deposit(
                            amount,
                            pledgePower,
                            cycle,
                            orderId,
                            poolCode,
                            devId,
                            minerNo
                        )
        
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
                        resolve(tx)
                        break;
                    default:
                        setTransactionStatus('failed')
                        resolve(verify_code)
                        break;
                }
            } catch (e) {
                reject(e)
                console.error(e)
            }
        })
    }

    const approval = async ({ setApprovestatus }) => {
        return new Promise(async (resolve, reject) => {
            try {

                const adam_contract = await adam_token()
                const approve = await adam_contract.methods.approve(miner_address, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

                setApprovestatus('confirm')
                const tx = approve.send({ from: account })

                tx.on('transactionHash', function (hash) {
                    setApprovestatus('pending')

                }).on('receipt', function (receipt) {
                    setApprovestatus('success')

                }).on('error', error => {
                    setApprovestatus('failed')
                    console.log('tx is failed ......', error)
                })

                resolve(tx)
            } catch (e) {
                reject(e)
                console.error(e)
            }
        })
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
        availPledage,
        set_pool_name,
        get_pool_name,
        add_machine,
        approval,
        get_allowance
    }
}
