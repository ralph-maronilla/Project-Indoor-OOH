import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCustomTheme from './theme';
import Sidebar from './components/navigation/Sidebar';
import { Box } from '@mui/material';
import { useAuthStore } from './store/authStore';

function App() {
  const [mode, setMode] = useState('dark'); // Manage light/dark mode state
  const theme = createCustomTheme(mode); // Dynamically create theme based on mode
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log('is authenticated: ', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Adds consistent global styles */}
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Sidebar mode={mode} setMode={setMode} />

        {/* Main content */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: 'auto',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
