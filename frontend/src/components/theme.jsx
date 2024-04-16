import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#a2d0d0',
      main: '#74aec4',
      dark: '#4e93b2',
      contrastText: '#fff',
    },
    secondary: {
      light: '#eba1b0',
      main: '#e1768a',
      dark: '#ca5669',
      contrastText: '#fff',
    },
  },
});

export default theme;
