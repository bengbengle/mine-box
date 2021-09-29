/**
 * Caution: Consider this file when using react-scripts
 * 
 * You may delete this file and its occurrences from the project filesystem if you are using GatsbyJS or NextJS version
 */
import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, HashRouter as Router, useHistory } from 'react-router-dom';
import WithLayout from 'WithLayout';
import { Main as MainLayout, Minimal as MinimalLayout, DocsLayout } from './layouts';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import { Toolbar, Button, IconButton } from '@material-ui/core'
import Web3Utils from 'web3-utils'

import {
  Home as HomeView,
  Welcome,
  MyMachine,
  AddMachine,
  MachineDetails,
  MyEarnings,
  MyStaking,
  Withdraw,
  UnStaking,
  StakingList
} from './views';

import ProfileModal from './components/ProfileModal'
import { useWallet } from './useWallet'
const OKEX_NETWORK_ID = 97
const Index = ({ themeMode, tabIndex, ...rest }) => {

  const [showModal, setShowModal] = useState(false)
  const [loadingend, setLoadingend] = useState(false)
  const [networkID, setnetworkID] = useState(OKEX_NETWORK_ID)
  const [poolName, setPoolName] = useState(null)
  const { get_pool_name, connect } = useWallet()

  const initweb3 = async () => {
    try {
      var web3 = await connect()
      web3.currentProvider.on('networkChanged', function (network) {
        setnetworkID(network)
        window.location.reload()
      })
      web3.currentProvider.on('accountsChanged', function (account) {
        console.log('accounts_changed:', account)
        window.location.reload()
      })
      let id = await web3.shh.net.getId()
      setnetworkID(id)
      console.log('id:' + id, 'okexid:' + OKEX_NETWORK_ID)
      if (id == OKEX_NETWORK_ID) {
        getpoolname()
      }
    } catch (e) {
      console.log('error:', e)
      setShowModal(false)
    }
  }

  const getpoolname = async () => {
    setLoadingend(false)
    let name = await get_pool_name()
    setPoolName(name)
    console.log('poolname:', name)
    setLoadingend(true)
  }

  const changeNetwork = async () => {
    await window.ethereum.enable();
    try {
      var hex = Web3Utils.toHex('97') // bsc testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hex }],
      });
      // swal("Mainnet", "Swich to Mainnet", "success");
    } catch (switchError) {
      if (switchError.code === -32002) {
        console.log('Already Pending', switchError)
        // swal("Already Pending", 'Request of type "wallet_switchEthereumChain" already pending, Please wait.', 'error')
      } else{
        console.log('Switch Mainnet', switchError)
        // https://faucet.ropsten.be/donate/WV98W3a7hYhBRIDPRGk8D/0xa8E7813150a988e7F20193983fA3017155F3C162
        // swal("Error!", 'Switch Mainnet', 'error')
      }
    }
  }

  useEffect(() => {
    initweb3()
    getpoolname()
  }, [])

  useEffect(() => {
    if (networkID == OKEX_NETWORK_ID) {
      getpoolname()
    }
  }, [networkID])

  useEffect(() => {
    if (networkID == OKEX_NETWORK_ID && loadingend && !poolName ) {
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }, [poolName, loadingend])

  return (
    <>
      {
        tabIndex == '0' ?
          <MyMachine themeMode={themeMode} tabIndex={tabIndex} {...rest} /> :
          tabIndex == '1' ?
            <MyStaking themeMode={themeMode} tabIndex={tabIndex} {...rest} /> :
            <MyEarnings themeMode={themeMode} tabIndex={tabIndex} {...rest} />
      }
      <div className='networkTips' style={{ display: networkID != OKEX_NETWORK_ID ? 'block' : 'none' }}>
        <Collapse in={networkID != OKEX_NETWORK_ID} style={{ width: '100%' }} >
          <Alert severity="error"
            action={
              // <IconButton
              //   aria-label="close"
              //   color="inherit"
              //   size="small"
              // >
              // </IconButton>
               <Button color="inherit" size="small" onClick={ changeNetwork }>Change</Button>
            }
          >
            Network Fault, Please change Network
          </Alert>
        </Collapse>
      </div>
      <ProfileModal show={showModal}
        handleCloseModal={() => setShowModal(false)}
      />
    </>
  )
}

const Routes = () => {
  return (
    <Router>
      <Route
        exact
        path="/"
        render={props => (
          <WithLayout
            {...props}
            component={Index}
            layout={MainLayout}
          />
        )}
      />
      {/* 我的矿机 */}
      <Route
        exact
        path="/home"
        render={props => (
          <WithLayout
            {...props}
            component={HomeView}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/welcome"
        render={props => (
          <WithLayout
            {...props}
            component={Welcome}
            layout={MinimalLayout}
          />
        )}
      />
      <Route
        exact
        path="/machines"
        render={props => (
          <WithLayout
            {...props}
            component={MyMachine}
            layout={MainLayout}
          />
        )}
      />

      <Route
        exact
        path="/earnings"
        render={props => (
          <WithLayout
            {...props}
            component={MyEarnings}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/staking"
        render={props => (
          <WithLayout
            {...props}
            component={MyStaking}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/addmachine"
        render={props => (
          <WithLayout
            // {...props}
            component={AddMachine}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/machineDetails"
        render={props => (
          <WithLayout
            {...props}
            component={MachineDetails}
            layout={MainLayout}
          />
        )}
      />
      <Route
        exact
        path="/withdraw"
        render={props => (
          <WithLayout
            {...props}
            component={Withdraw}
            layout={MainLayout}
          />
        )}
      />
      <Route path="/stakinglist" render={props => <WithLayout {...props} component={StakingList} layout={MainLayout} /> } />
      <Route path="/unstaking" render={props => <WithLayout {...props} component={UnStaking} layout={MainLayout} /> } />
      <Redirect to="/" />
    </Router>
  );
};

export default Routes;
