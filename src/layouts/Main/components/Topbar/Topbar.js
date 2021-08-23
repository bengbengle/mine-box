import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Toolbar, Button, IconButton } from '@material-ui/core'
import { Image } from 'components/atoms'
import { useWallet } from '../../../../useWallet'
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  flexGrow: {
    flexGrow: 1,
  },
  navigationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbar: {
    zIndex: 999,
    maxWidth: theme.layout.contentWidth,
    width: '100%',
    margin: '0px auto',
    position: 'sticky',
    background: '#1a202c',
    top: '0px',
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    boxShadow: '0px 0px 29px 0px rgb(255 107 34 / 25%)'
  },
  listItem: {
    cursor: 'pointer',
    '&:hover > .menu-item, &:hover svg': {
      color: theme.palette.primary.dark,
    },
    '&.menu-item--no-dropdown': {
      paddingRight: 0,
    },
  },
  listItemButton: {
    whiteSpace: 'nowrap',
  },
  listItemIcon: {
    minWidth: 'auto',
  },
  popover: {
    padding: theme.spacing(4),
    border: theme.spacing(2),
    boxShadow: '0 0.5rem 2rem 2px rgba(116, 123, 144, 0.09)',
    minWidth: 350,
    marginTop: theme.spacing(2),
  },
  iconButton: {
    marginLeft: theme.spacing(2),
    padding: 0,
    '&:hover': {
      background: 'transparent',
    },
  },
  logoContainer: {
    width: 120,
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      width: 135,
      height: 'auto',
    },
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  menu: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  account: {
    display: 'flex',
    flexDirection: 'row',
    'align-items': 'center',
    'justify-content': 'space-between',
    'width': '100%',
    'padding': '0px 15px',
    'max-width': '1236px',
    'min-width': '275px'
  },
  accountIcon: {
    marginRight: '7px',
    display: 'flex'
  },
  accountWallet: {
    // 'margin-left': 'auto'
  },
  accountAddress: {
    'margin-left': 'auto',
    display: 'flex',
    alignItems: 'center',
    'border-radius': '25px',
    color: '#999999',
    background: '#303030',
    padding: '0px 18px 0px 0px'
  }
}))

const OKEX_NETWORK_ID = 65
const Topbar = ({ themeMode, themeToggler, onSidebarOpen, className, ...rest }) => {

  const classes = useStyles()

  const [accountDisplay, setAccountDisplay] = useState('')

  const { connect, account } = useWallet()
  const [networkID, setnetworkID] = useState(65)

  const AccountIcon = props => <img src='/assets/pubkey.png' style={{ width: '1.5rem', height: '1.5rem' }} />
  const ExchangeIcon = props => <img src='/assets/exchange.png' style={{ width: '1rem', height: '1rem' }} />

  const shortAccount = async () => {
    // var web3 = await connect()
    // web3.currentProvider.on('networkChanged', function (network) {
    //   console.log('network .. changed ...', network)
    //   setnetworkID(network)
    //   if(networkID == OKEX_NETWORK_ID) window.location.reload()
    // })
    // web3.shh.net.getId().then(id=>{
    //   setnetworkID(id)
    // })
    if (!account) return ''
    let start = account.substr(0, 4)
    let end = account.substr(account.length - 4, 4)
    let show = start + '..' + end
    setAccountDisplay(show)
  }

  useEffect(() => {
    shortAccount()
  }, [account, connect])

 

  return (
    <Toolbar disableGutters className={classes.toolbar} {...rest}>
      {/* <div className={'networkTips'} style={{ display: networkID != 65 ? 'block' : 'none' }}>
        <Collapse in={networkID != 65} >
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
            Network Error
          </Alert>
        </Collapse>
      </div> */}
      <div className={classes.account}>
        <div className={classes.logoContainer}>
          <a href="/#/" title="Powerhub">
            <Image
              className={classes.logoImage}
              src={'/assets/logo.png'}
              alt="thefront"
              lazy={false}
            />
          </a>
        </div>
        <div className={classes.accountAddress}>
          <div className={classes.accountIcon}>
            <AccountIcon />
          </div>
          {accountDisplay}
        </div>

        <div className={classes.accountWallet}>
          <Button
            onClick={e => connect()}
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<ExchangeIcon />}
          >
            Wallet
          </Button>
        </div>
      </div>
    </Toolbar>
  )
}

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
  themeToggler: PropTypes.func.isRequired,
  themeMode: PropTypes.string.isRequired,
}

export default Topbar
