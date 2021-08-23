import { responsiveFontSizes } from '@material-ui/core';
import { light, dark } from './palette';
import { createTheme } from '@material-ui/core/styles';

const getTheme = mode => responsiveFontSizes(
  createTheme({
    palette: mode === 'light' ? light : dark,
    layout: {
      contentWidth: 1236,
    },
    typography: {
      fontFamily: 'Alibaba PuHuiTi',
    },
    zIndex: {
      appBar: 1200,
      drawer: 1100,
    },
    shape: {
      borderRadius: '20px'
    },
    spacing: 10,
    transitions: {
      duration: 5
    },
  }),
);

export default getTheme;
