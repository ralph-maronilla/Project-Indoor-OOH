import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import createCustomTheme from './theme';
import Sidebar from './components/navigation/Sidebar';
import { useAppStateStore } from '../src/store/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function App() {
  const [mode, setMode] = useState('dark');
  const theme = createCustomTheme(mode);

  const portalCheckAuthUrl = useAppStateStore(
    (state) => state.portalCheckAuthUrl
  );
  const portalUrl = useAppStateStore((state) => state.portalUrl);
  const setAuthUser = useAppStateStore((state) => state.setAuthUser);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('auth user:', useAppStateStore.getState().authUser);
  }, []);

  // useEffect(() => {
  //   const checkToken = async () => {
  //     const getTokenFromFragment = () => {
  //       const hash = window.location.hash;
  //       const params = new URLSearchParams(hash.substring(1));
  //       return params.get("access_token");
  //     };

  //     const tokenFromUrl = getTokenFromFragment();

  //     if (tokenFromUrl) {
  //       localStorage.setItem("authToken", tokenFromUrl);
  //       window.history.replaceState({}, document.title, window.location.pathname);
  //     }

  //     const token = localStorage.getItem("authToken");

  //     if (token) {
  //       try {
  //         setIsLoading(true);
  //         const response = await fetch(portalCheckAuthUrl, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`
  //           },
  //           credentials: "include"
  //         });

  //         const data = await response.json();

  //         if (data.success && data.user) {
  //           setAuthUser(data.user);
  //           console.log("User successfully authenticated:", data.user);
  //         } else {
  //           localStorage.removeItem("authToken");
  //           window.location.href = portalUrl;
  //         }
  //       } catch (error) {
  //         console.error("Token validation error:", error);
  //         localStorage.removeItem("authToken");
  //         window.location.href = portalUrl;
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     } else {
  //       window.location.href = portalUrl;
  //     }

  //     setIsTokenChecked(true);
  //   };

  //   checkToken();
  // }, [portalCheckAuthUrl, portalUrl, setAuthUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position='top-right' reverseOrder={false} />
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <Sidebar mode={mode} setMode={setMode} />

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
    </QueryClientProvider>
  );
}

export default App;
