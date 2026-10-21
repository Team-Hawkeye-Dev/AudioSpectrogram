import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#5b6cf9' },
    background: {
      default: '#2e2e2e',
      paper: '#3d3d3d',
    },
    text: {
      primary: '#f0f0f0',
      secondary: '#b3b3b3',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
  },
});
