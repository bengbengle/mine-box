import React, { useState, useEffect } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import getTheme from 'theme'
import AOS from 'aos'
import useWallet from './useWallet'

export const useDarkMode = (idx) => {
 
  const [themeMode, setTheme] = useState('dark')
  const [tabIndex, setLocalTabIndex] = useState(idx || '0')
  const [mountedComponent, setMountedComponent] = useState(false)
  
  const setTabIndex = idx => {
    window.localStorage.setItem('idx', idx)
    setLocalTabIndex(idx)
  }

  const setMode = mode => {
    window.localStorage.setItem('themeMode', mode)
    setTheme(mode)
  }
  
  const themeToggler = () => {
    themeMode === 'light' ? setMode('dark') : setMode('light')
  }

  useEffect(() => {
    setMountedComponent(true)
  }, [tabIndex])

  return [themeMode, themeToggler, mountedComponent, tabIndex, setTabIndex]
}

export default function WithLayout({ component: Component, layout: Layout, ...rest }) {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }

    AOS.init({
      once: true,
      delay: 50,
      duration: 500,
    })
  }, [])

  let idx = localStorage.getItem('idx')

  const [themeMode, themeToggler, mountedComponent, tabIndex, setTabIndex] = useDarkMode(idx)
 
  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <Paper elevation={0}>
        <Layout themeMode={themeMode} themeToggler={themeToggler} tabIndex={tabIndex} setTabIndex={setTabIndex}>
          <Component themeMode={themeMode} tabIndex={tabIndex} {...rest} />
        </Layout>
      </Paper>
    </ThemeProvider>
  )
}