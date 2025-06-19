import { createTheme } from '@mui/material/styles';

const colors = {
  primary: {
    100: '#FFF1E6',
    500: '#ea5b20',
  },
  dark: {
    100: '#000000',
    200: '#0F1117',
    300: '#151821',
    400: '#212734',
    500: '#101012',
  },
  light: {
    400: '#858EAD',
    500: '#7B8EC8',
    700: '#DCE3F1',
    800: '#F4F6F8',
    850: '#FDFDFD',
    900: '#FFFFFF',
  },
};

// Function to create a theme based on the mode
const createCustomTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: colors.primary[500],
              light: colors.primary[100],
            },
            background: {
              default: colors.light[850],
              paper: colors.light[800],
            },
            text: {
              primary: colors.dark[200],
              secondary: colors.dark[500],
            },
            hover: {
              primary: colors.light[700],
              secondary: colors.light[500],
            },
          }
        : {
            primary: {
              main: colors.primary[500],
              light: colors.primary[100],
            },
            background: {
              default: colors.dark[300],
              paper: colors.dark[400],
            },
            text: {
              primary: colors.light[900],
              secondary: colors.light[200],
            },
            hover: {
              primary: colors.dark[300],
              secondary: colors.dark[400],
            },
          }),
    },
    breakpoints: {
      values: {
        xs: 0, // phone
        sm: 600, // tablets
        md: 900, // small laptops
        lg: 1200, // desktops
        xl: 1536, // large screens
      },
    },
    typography: {
      fontFamily: 'Montserrat, Arial, sans-serif',
      h1: {
        fontSize: '2rem',
      },
      h2: {
        fontSize: '1.5rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none', // Disable uppercase for buttons
          },
        },
      },
    },
  });

export default createCustomTheme;
