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

import {
  Home as HomeView,
  Welcome,
  MyMachine,
  AddMachine,
  MachineDetails,
  MyEarnings,
  MyStaking,
  Withdraw,
  UnStaking
} from './views';

import ProfileModal from './components/ProfileModal'
import { useWallet } from './useWallet'
const OKEX_NETWORK_ID = 65
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
      <div className='networkTips' style={{ display: networkID != 65 ? 'block' : 'none' }}>
        <Collapse in={networkID != 65} style={{ width: '100%' }} >
          <Alert severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
              >
              </IconButton>
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
      <Route
        exact
        path="/unstaking"
        render={props => (
          <WithLayout
            {...props}
            component={UnStaking}
            layout={MainLayout}
          />
        )}
      />

      <Redirect to="/" />
    </Router>
  );
};

export default Routes;
